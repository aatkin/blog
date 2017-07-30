import { Server } from "./Server";
import { debug } from "./utils/Logging";


const application = Server.bootstrap();
application.start(4730, () => {
    debug("Server running on port 4730");
});
