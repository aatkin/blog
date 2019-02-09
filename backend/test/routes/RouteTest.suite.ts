/* tslint:disable:no-unused-expression */

// needs to be imported here in order to use container and typeorm properly
import "reflect-metadata";

import * as chai from "chai";
import chaiHttp = require("chai-http");
import * as express from "express";
const { expect } = chai;
chai.use(chaiHttp);

import { Server } from "src/Server";
import { container } from "test/inversify.config.test";

describe("simple get route", () => {
  let server: Server;

  before(() => {
    const route = express.Router();
    route.get("/", (req, res, next) => {
      res.status(200).json({ test: true });
    });
    server = new Server(
      container,
      undefined,
      () => {},
      app => {
        app.use("/test", route);
      }
    );
  });

  it("should return 200", done => {
    chai
      .request(server.app)
      .get("/test")
      .end((err, res) => {
        expect(err).to.not.exist;
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should return json response", done => {
    chai
      .request(server.app)
      .get("/test")
      .end((err, res) => {
        expect(res).to.be.json;
        expect(res.body.test).to.be.true;
        done();
      });
  });
});
