import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import * as express from "express";

import { Server } from "../src/Server";

chai.use(chaiHttp);
const { expect } = chai;

describe("simple get route", () => {
    let server: Server;

    before(() => {
        const route = express.Router();
        route.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(200).json({ test: true });
        });
        server = new Server(null, () => {}, (app) => { app.use("/test", route); });
    });

    it("should return 200", (done: Function) => {
        chai.request(server.app)
            .get("/test")
            .end((err, res) => {
                expect(err).to.not.exist;
                expect(res).to.have.status(200);
                done();
            });
    });

    it("should return json response", (done: Function) => {
        chai.request(server.app)
            .get("/test")
            .end((err, res) => {
                expect(res).to.be.json;
                expect(res.body.test).to.be.true;
                done();
            });
    });
});
