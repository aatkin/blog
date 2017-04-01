import { Server } from "./Server";
import { debug } from "./utils/Logging";

const application = new Server();
application.start(4730, () => {
    debug("Server running on port 4730");
});
