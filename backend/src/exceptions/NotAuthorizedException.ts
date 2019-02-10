import { Exception } from "src/exceptions/Exception";

export class NotAuthorizedException extends Exception {
  constructor(message: string = "Not authorized") {
    super(message, "NotAuthorizedException");
  }
}
