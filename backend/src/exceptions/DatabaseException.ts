import { Exception } from "src/exceptions/Exception";

export class DatabaseException extends Exception {
  constructor(message?: string) {
    super(message, "DatabaseException");
  }
}
