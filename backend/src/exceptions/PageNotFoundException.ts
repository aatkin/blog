import { Exception } from "src/exceptions/Exception";

export class PageNotFoundException extends Exception {
  constructor(message?: string) {
    super(message, "PageNotFoundException");
  }
}
