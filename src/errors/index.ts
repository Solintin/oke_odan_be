export class SystemError extends Error {
  private _code?: number;

  private _errors?: Array<unknown>;

  get code(): number | undefined {
    return this._code;
  }

  get errors(): Array<unknown> | undefined {
    return this._errors;
  }

  constructor(
    code: number,
    message: string = "an error occurred",
    errors?: Array<unknown>
  ) {
    super(message); // 'Error' breaks prototype chain here
    this._code = code || 500;
    this.message = message;
    this._errors = errors;
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export class ApplicationError extends SystemError {
  constructor(code: number, message: string, errors?: Array<unknown>) {
    super(code, message, errors);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends SystemError {
  constructor(message?: string) {
    super(404, message || "Resource not found.");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ConflictError extends SystemError {
  constructor(message: string) {
    super(409, message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends SystemError {
  constructor(message?: string) {
    super(401, message || "You are not authorized to access this resource.");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends SystemError {
  constructor(message?: string) {
    super(400, message || "Bad Request");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ForbiddenError extends SystemError {
  constructor(message?: string) {
    super(403, message || "Access Denied");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
