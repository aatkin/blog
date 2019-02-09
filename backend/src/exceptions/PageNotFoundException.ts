import { Exception } from "./Exception";

export class PageNotFoundException extends Exception {
  constructor(message?: string) {
    super(message, "PageNotFoundException");
  }
}
