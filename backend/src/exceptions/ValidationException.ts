import { Exception } from "src/exceptions/Exception";

export class ValidationException extends Exception {
  constructor(message?: string) {
    super(message, "ValidationException");
  }
}
