import { Exception } from "src/exceptions/Exception";

export class ValidationException extends Exception {
  constructor(message: string = "Validation failed") {
    super(message, "ValidationException");
  }
}
