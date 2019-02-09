import { Exception } from "./Exception";

export class RoleNotFoundException extends Exception {
  constructor(message?: string) {
    super(message, "RoleNotFoundException");
  }
}
