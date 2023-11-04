import { MicroserviceEnvVariables } from '@/microserviceFactory.factory';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { stringifySafe } from '../utils/utils';

@Injectable()
export class LoggerService {
  private winstonLogger: winston.Logger;

  constructor(private configService: ConfigService) {
    // Initialize the Winston logger with various transports for different log levels
    this.winstonLogger = winston.createLogger({
      level: 'info', // Specify the default log level
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()), // Define log format
      transports: [
        // Log to the console with a different format
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'DD/MM/YYYY, h:mm:ss a' }),
            winston.format.printf(({ timestamp, level, message, context, trace }) => {
              const serviceName = new MicroserviceEnvVariables(configService).SERVICE_NAME;
              let formattedMessage = `[${serviceName}] ${timestamp} \t [${level.toUpperCase()}]${context ? ` [${context}]` : ''}: `;

              if (message) {
                formattedMessage += stringifySafe(message);
              }

              if (trace) {
                formattedMessage += `\n${trace}`;
              }

              return formattedMessage;
            }),
          ),
        }),
        // Log to daily rotating files for regular logs
        new DailyRotateFile({
          filename: 'logs/app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '2d', // Log rotation - keep logs for 2 days, remove older log files
          level: 'info',
        }),
        // Log errors to separate files with rotation
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '7d', // Log rotation - keep logs for 7 days, remove older log files
          level: 'error',
        }),
      ],
    });
  }

  /**
   * Log a message with the 'info' log level.
   * @param message - The message to log.
   * @param context - Additional context information.
   */
  log(message: string, context?: string) {
    this.logWithTimestamp('info', message, context);
  }

  /**
   * Log an error message with the 'error' log level.
   * @param message - The error message to log.
   * @param trace - Stack trace or error details.
   * @param context - Additional context information.
   */
  error(message: string, trace: string, context?: string) {
    this.logWithTimestamp('error', message, context, trace);
  }

  /**
   * Log a warning message with the 'warn' log level.
   * @param message - The warning message to log.
   * @param context - Additional context information.
   */
  warn(message: string, context?: string) {
    this.logWithTimestamp('warn', message, context);
  }

  /**
   * Log a debug message with the 'debug' log level.
   * @param message - The debug message to log.
   * @param context - Additional context information.
   */
  debug(message: string, context?: string) {
    this.logWithTimestamp('debug', message, context);
  }

  /**
   * Log a message to the database. You can implement database integration here.
   * @param message - The message to log in the database.
   * @param context - Additional context information.
   */
  logToDatabase(message: string, context?: string) {
    // Implement database integration here
  }

  /**
   * Log an HTTP request with method, URL, status code, and user-agent information.
   * @param request - The incoming HTTP request.
   * @param response - The HTTP response.
   * @param next - The next function in the middleware chain.
   */
  logRequest(request: any, response: any, next: () => void) {
    const { method, url } = request;
    const userAgent = request.headers['user-agent'];

    response.on('finish', () => {
      const { statusCode } = response;
      const logMessage = `${method} ${url} - ${statusCode} - ${userAgent}`;
      this.log(logMessage, 'HTTP');
    });

    next();
  }

  /**
   * Private method to log with a timestamp and context.
   * @param level - Log level ('info', 'error', 'warn', 'debug').
   * @param message - The message to log.
   * @param context - Additional context information.
   * @param trace - Stack trace or error details (for error logging).
   */
  private logWithTimestamp(level: string, message: string, context?: string, trace?: string) {
    this.winstonLogger.log({ level, message, context, trace });
  }
}
