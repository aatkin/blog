import { Container, injectable } from "inversify";

import { ILogger } from "../src/utils";
import { Types } from "../src/Types";


@injectable()
export class MockLogger
{
    public error(...args: any[]) { }
    public warn(...args: any[]) { }
    public info(...args: any[]) { }
    public verbose(...args: any[]) { }
    public debug(...args: any[]) { }
    public silly(...args: any[]) { }
}

const container = new Container();

container.bind<ILogger>(Types.Logger).to(MockLogger).inSingletonScope();

export { container };
