export declare class Error
{
    public name: string;
    public message: string;
    public stack: string;
    constructor(message?: string);
}

export class Exception extends Error
{
    constructor(public message: string = "", name: string)
    {
        super(message);
        this.name = name;
        this.message = message;
        this.stack = (<any>new Error()).stack;
    }

    public toString()
    {
        return this.name + ": " + this.message;
    }
}
