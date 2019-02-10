import { Exception } from "src/exceptions/Exception";

export class ActorNotFoundException extends Exception {
  constructor(message: string = "Actor not found") {
    super(message, "ActorNotFoundException");
  }
}
