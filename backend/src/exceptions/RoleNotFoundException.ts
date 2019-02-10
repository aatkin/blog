import { Exception } from "src/exceptions/Exception";

export class RoleNotFoundException extends Exception {
  constructor(message: string = "Role not found") {
    super(message, "RoleNotFoundException");
  }
}
