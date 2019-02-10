export declare class Error {
  public name: string;
  public message: string;
  public stack: string;
  constructor(message?: string);
}

export class Exception extends Error {
  public static fromError<T extends Exception>(e: Error): T {
    const exception = new Exception(e.message, e.name);
    exception.stack = e.stack;
    return exception as T;
  }

  constructor(public message: string = "", name: string) {
    super(message);
    this.name = name;
    this.message = message;
    this.stack = (new Error() as any).stack;
  }

  public toString() {
    return this.name + ": " + this.stack;
  }
}
