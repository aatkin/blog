import { Exception } from "src/exceptions/Exception";

export class InternalServerException extends Exception {
  constructor(message?: string) {
    super(message, "InternalServerException");
  }
}
