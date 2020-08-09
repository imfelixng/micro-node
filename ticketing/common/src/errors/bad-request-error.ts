import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
    statusCode = 400;

    constructor(public message: string) {
        super("Bad request");

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, BadRequestError.prototype); // bring it all prototype to this (js)
    }

    serializeErrors() {
        return [
            { message: this.message, }
        ];
    }
}
