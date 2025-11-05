export abstract class BaseException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
    };
  }
}

export class DomainException extends BaseException {
  constructor(message: string, code: string = 'DOMAIN_ERROR') {
    super(message, code, 400);
  }
}

export class ApplicationException extends BaseException {
  constructor(
    message: string,
    code: string = 'APPLICATION_ERROR',
    statusCode: number = 500,
  ) {
    super(message, code, statusCode);
  }
}

export class NotFoundException extends BaseException {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, 'NOT_FOUND', 404);
  }
}

export class ValidationException extends BaseException {
  constructor(
    message: string,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenException extends BaseException {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
  }
}
