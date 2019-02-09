import { Exception } from "src/exceptions/Exception";

export class UserNotFoundException extends Exception {
  constructor(message?: string) {
    super(message, "UserNotFoundException");
  }
}
