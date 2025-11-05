import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorInfo {
  status: number;
  message: string | string[];
  error: string;
  details?: any;
}

/**
 * Global exception filter that catches all exceptions and formats them consistently
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const { request, response } = this.extractContext(host);
    const errorInfo = this.extractErrorInfo(exception);
    const formattedMessage = this.formatMessage(errorInfo.message);

    this.logError(request, errorInfo.status, formattedMessage, exception);

    const errorResponse = this.buildErrorResponse(
      request,
      errorInfo,
      formattedMessage,
    );

    response.status(errorInfo.status).json(errorResponse);
  }

  private extractContext(host: ArgumentsHost): {
    request: Request;
    response: Response;
  } {
    const ctx = host.switchToHttp();
    return {
      request: ctx.getRequest<Request>(),
      response: ctx.getResponse<Response>(),
    };
  }

  private extractErrorInfo(exception: unknown): ErrorInfo {
    if (exception instanceof HttpException) {
      return this.extractHttpExceptionInfo(exception);
    }

    if (exception instanceof Error) {
      return this.extractErrorExceptionInfo(exception);
    }

    return this.extractUnknownExceptionInfo(exception);
  }

  private extractHttpExceptionInfo(exception: HttpException): ErrorInfo {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      return {
        status,
        message: exceptionResponse,
        error: exception.constructor.name,
      };
    }

    if (typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as any;
      return {
        status,
        message: responseObj.message || exception.message,
        error: responseObj.error || exception.constructor.name,
        details: responseObj.details || undefined,
      };
    }

    return {
      status,
      message: exception.message,
      error: exception.constructor.name,
    };
  }

  private extractErrorExceptionInfo(exception: Error): ErrorInfo {
    this.logger.error(
      `Unhandled exception: ${exception.message}`,
      exception.stack,
    );

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message || 'Internal server error',
      error: exception.constructor.name || 'Error',
    };
  }

  private extractUnknownExceptionInfo(exception: unknown): ErrorInfo {
    this.logger.error('Unhandled exception of unknown type', exception);

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'UnknownError',
    };
  }

  private formatMessage(message: string | string[]): string | string[] {
    if (!Array.isArray(message) || message.length === 0) {
      return message;
    }

    return message.map((msg) => {
      if (typeof msg === 'string') {
        return msg;
      }
      return Object.values(msg).join(', ');
    });
  }

  private logError(
    request: Request,
    status: number,
    message: string | string[],
    exception: unknown,
  ): void {
    const logMessage = `${request.method} ${request.url} - ${status} - ${message}`;
    const stack = exception instanceof Error ? exception.stack : undefined;

    if (status >= 500) {
      this.logger.error(logMessage, stack);
    } else {
      this.logger.warn(logMessage);
    }
  }

  private buildErrorResponse(
    request: Request,
    errorInfo: ErrorInfo,
    message: string | string[],
  ): object {
    return {
      statusCode: errorInfo.status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: errorInfo.error,
      message,
      ...(errorInfo.details && { details: errorInfo.details }),
    };
  }
}
