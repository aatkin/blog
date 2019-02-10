import { Exception } from "src/exceptions/Exception";

export class UserNotFoundException extends Exception {
  constructor(message: string = "User not found") {
    super(message, "UserNotFoundException");
  }
}
