export declare class Error {
  public name: string;
  public message: string;
  public stack: string;
  constructor(message?: string);
}

export class Exception extends Error {
  constructor(public message: string = "", name: string) {
    super(message);
    this.name = name;
    this.message = message;
    this.stack = (new Error() as any).stack;
  }

  public toString() {
    return this.name + ": " + this.message;
  }
}
