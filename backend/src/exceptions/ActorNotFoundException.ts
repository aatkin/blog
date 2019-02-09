import { Exception } from "./Exception";

export class ActorNotFoundException extends Exception {
  constructor(message?: string) {
    super(message, "ActorNotFoundException");
  }
}
