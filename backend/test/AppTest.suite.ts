// needs to be imported here in order to use container and typeorm properly
import "reflect-metadata";

import * as mocha from "mocha";
import { expect, assert } from "chai";

import { Server } from "../src/Server";


describe("empty server", () =>
{
    it("should have app property", () =>
    {
        const server = new Server(null, null, () => {}, () => {});
        assert.isDefined(server.app);
        assert.isNotNull(server.app);
    });
});
