import { Exception } from "src/exceptions/Exception";

export class DatabaseException extends Exception {
  constructor(message: string = "Exception during database operation") {
    super(message, "DatabaseException");
  }
}
