"use strict";

const fs = require("fs");
const path = require("path");
const exphbs = require("express-handlebars");
const Promise = require("bluebird");
const rimraf = require("rimraf");

const config = require("./config/config");
const db = require("./backend/models");


const hbs = exphbs.create({
    defaultLayout: "main",
    partialsDir: "backend/views/partials",
    layoutsDir: "backend/views/layouts",
    extname: ".hbs"
});

hbs._renderView = function (viewPath, options, callback) {
    let _options = options ? options : {};
    _options.settings = {
        views: "backend/views"
    };
    this.renderView(viewPath, _options, callback);
};

const api = module.exports = {
    compileTemplate (name, data) {
        if (!data) {
            data = {};
        }

        return new Promise((resolve, reject) => {
            if (!name) {
                reject(`ERROR: Template could not be compiled: param name is missing`);
            }

            const templatePath = path.resolve(`backend/views/${name}.hbs`);

            try {
                fs.statSync(templatePath);

                hbs._renderView(templatePath, data, (error, template) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(template);
                });
            } catch (e) {
                reject(e);
            }
        });
    },

    compilePost (post) {
        return new Promise((resolve, reject) => {
            if (!post) {
                reject(`ERROR: Post could not be compiled: ${post}`);
            }

            hbs._renderView("backend/views/post.hbs", {
                title: `Blog: ${post.title}`,
                post
            }, (error, data) => {
                if (error) {
                    return reject(error);
                }
                return resolve(data);
            });
        });
    },

    fetchPosts () {
        return new Promise((resolve, reject) => {
            db.post.findAll().then((posts) => {
                // attach body to all posts
                posts.forEach((post) => {
                    const filepath = path.resolve(`${config.dataPath}/${post.fileid}`);
                    const body = fs.readFileSync(filepath, "utf8");
                    post.body = body;
                });
                resolve(posts);
            });
        });
    },

    buildIndexPage (posts) {
        return new Promise((resolve, reject) => {
            if (posts && posts.length) {
                api.compileTemplate("index", { posts }).then((template) => {
                    resolve(template);
                }).catch((error) => {
                    reject(error);
                });
            } else {
                api.fetchPosts().then((fetchedPosts) => {
                    api.compileTemplate("index", { posts: fetchedPosts }).then((template) => {
                        resolve(template);
                    }).catch((error) => {
                        reject(error);
                    });
                });
            }
        });
    }
};

// run as main
if (require.main === module) {
    console.time("buildStaticContent");
    // clear public folder and replace it with content from database
    new Promise((resolve, reject) => {
        console.log("clearing static files...")
        rimraf("public/static/**/*.html", () => {
            // create static folder if it does not exist
            if (!fs.existsSync("public/static")) {
                console.log(`creating folder ${path.resolve("public/static")}...`);
                fs.mkdirSync(path.resolve("public/static"));
            }
            console.log("done");
            resolve();
        });
    }).then(() => {
        console.log("fetching posts...");
        return new Promise((resolve, reject) => {
            api.fetchPosts().then((posts) => {
                console.log("done, found", posts.length, "posts");
                resolve(posts);
            });
        });
    }).then((posts) => {
        console.log("compiling posts...");
        return new Promise((resolve, reject) => {
            let promises = posts.map((post) => {
                return Promise.props({
                    compiledTemplate: api.compilePost(post),
                    filename: post.dataValues.urlSlug
                });
            });
            // add index.html to the group
            promises.push(Promise.props({
                compiledTemplate: api.buildIndexPage(posts),
                filename: "index"
            }));
            Promise.all(promises).then((compiledTemplates) => {
                console.log("done");
                resolve(compiledTemplates);
            });
        });
    }).then((compiledTemplates) => {
        compiledTemplates.forEach((item) => {
            let filepath = path.resolve(`public/static/${item.filename}.html`);
            console.log("writing to file", filepath);
            fs.writeFileSync(filepath, item.compiledTemplate);
        });
        console.timeEnd("buildStaticContent");
        process.exit(0);
    });
}
