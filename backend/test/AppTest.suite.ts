// needs to be imported here in order to use container and typeorm properly
import "reflect-metadata";

import { assert } from "chai";

import { Server } from "src/Server";

describe("empty server", () => {
  it("should have app property", () => {
    const server = new Server(null, undefined, () => {}, () => {});
    assert.isDefined(server.app);
    assert.isNotNull(server.app);
  });
});
