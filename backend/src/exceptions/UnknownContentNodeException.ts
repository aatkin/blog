import { Exception } from "src/exceptions/Exception";

export class UnknownContentNodeException extends Exception {
  constructor(message?: string) {
    super(message, "UnknownContentNodeException");
  }
}
