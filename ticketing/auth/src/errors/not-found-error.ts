import { CustomError } from "./custom-error.ts";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
      super('Route not found');
      Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [
        {
            message: 'Not Found',
        }
    ]
  }
}
