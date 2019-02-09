import { Exception } from "src/exceptions/Exception";

export class RoleNotFoundException extends Exception {
  constructor(message?: string) {
    super(message, "RoleNotFoundException");
  }
}
