import { Exception } from "src/exceptions/Exception";

export class ActorNotFoundException extends Exception {
  constructor(message?: string) {
    super(message, "ActorNotFoundException");
  }
}
