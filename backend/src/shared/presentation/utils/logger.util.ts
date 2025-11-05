import { Logger } from '@nestjs/common';

/**
 * Utility class for creating module-specific loggers
 */
export class LoggerUtil {
  /**
   * Creates a logger instance for a specific module
   */
  static create(context: string): Logger {
    return new Logger(context);
  }

  /**
   * Logs method entry with parameters
   */
  static logMethodEntry(
    logger: Logger,
    methodName: string,
    params?: Record<string, any>,
  ): void {
    if (params) {
      logger.debug(`→ ${methodName}(${JSON.stringify(params)})`);
    } else {
      logger.debug(`→ ${methodName}()`);
    }
  }

  /**
   * Logs method exit with result
   */
  static logMethodExit(logger: Logger, methodName: string, result?: any): void {
    if (result !== undefined) {
      logger.debug(`← ${methodName}(): ${JSON.stringify(result)}`);
    } else {
      logger.debug(`← ${methodName}()`);
    }
  }

  /**
   * Logs method error
   */
  static logMethodError(
    logger: Logger,
    methodName: string,
    error: Error,
  ): void {
    logger.error(`✗ ${methodName}(): ${error.message}`, error.stack);
  }
}
