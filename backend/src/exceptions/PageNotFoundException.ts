import { Exception } from "src/exceptions/Exception";

export class PageNotFoundException extends Exception {
  constructor(message: string = "Page not found") {
    super(message, "PageNotFoundException");
  }
}
