import { DatabaseManager } from "./DatabaseManager";
import { Server } from "./Server";
import { debug, error } from "./utils/Logging";
import { Role, User } from "./models";


async function startup()
{
    try
    {
        // establish db connection using ormconfig "dev"
        const connection = await DatabaseManager.createConnection();

        // fixture data
        const roleRepository = connection.getRepository(Role);
        const userRepository = connection.getRepository(User);

        const role: Role = {
            guid: "non-sense-test-123",
            name: "Admin",
            value: "ADMIN"

        };
        await roleRepository.persist(role);

        const user: User = {
             guid: "non-sense-user-123",
             name: "Testikäyttäjä",
             role
        };
        await userRepository.persist(user);

        const application = Server.bootstrap();
        application.start(4730, () =>
        {
            debug("Server running on port 4730");
        });
    }
    catch (e)
    {
        error("Connection problem with database:");
        console.log(e);
    }
}

startup();
