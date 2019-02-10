import { Exception } from "src/exceptions/Exception";

export class NotAuthorizedException extends Exception {
  constructor(message?: string) {
    super(message, "NotAuthorizedException");
  }
}
