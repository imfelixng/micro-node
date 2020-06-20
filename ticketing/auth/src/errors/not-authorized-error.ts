import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Not Authorized");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotAuthorizedError.prototype); // bring it all prototype to this (js)
  }

  serializeErrors() {
    return [{ message: "Not Authorized" }];
  }
}
