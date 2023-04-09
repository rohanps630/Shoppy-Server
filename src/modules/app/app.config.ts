import * as Joi from 'joi';
import { AppController } from './app.controller';
import { ConfigModuleOptions, ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@nestjs/platform-express';
import { IncomingMessage, ServerResponse } from 'http';
import { LogLevel, NodeEnv } from '@share/enums';
import { Params } from 'nestjs-pino';
import { RequestMethod } from '@nestjs/common';

export class AppConfig {
  public static getExpressInstance(): ExpressAdapter {
    return new ExpressAdapter();
  }

  public static getInitConifg(): ConfigModuleOptions {
    const validLogLevelList = Object.keys(LogLevel).map((key) => LogLevel[key]);
    const validNodeEnvList = Object.keys(NodeEnv).map((key) => NodeEnv[key]);

    return {
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object(<
        { [P in keyof NodeJS.ProcessEnv]: Joi.SchemaInternals }
      >{
        BASE_PATH: Joi.string().allow('').optional(),
        CLUSTERING: Joi.boolean().required(),
        LOG_LEVEL: Joi.string()
          .allow('')
          .valid(...validLogLevelList)
          .optional(),
        NODE_ENV: Joi.string()
          .valid(...validNodeEnvList)
          .required(),
        PORT: Joi.number().min(1).max(65535).required(),
        DB_URL: Joi.string(),
        JWT_SECRET: Joi.string(),
      }),
    };
  }

  public static getLoggerConfig(): Params {
    const { BASE_PATH, CLUSTERING, LOG_LEVEL, NODE_ENV } = process.env;

    return {
      // Exclude may not work for e2e testing
      exclude: [
        {
          method: RequestMethod.ALL,
          path: `${BASE_PATH}/${AppController.prototype.healthz.name}`,
        },
      ],
      pinoHttp: {
        autoLogging: true,
        base: CLUSTERING === 'true' ? { pid: process.pid } : {},
        customAttributeKeys: {
          responseTime: 'timeSpent',
        },
        level:
          LOG_LEVEL ||
          (NODE_ENV === NodeEnv.PRODUCTION ? LogLevel.INFO : LogLevel.TRACE),
        serializers: {
          req(request: IncomingMessage) {
            return {
              method: request.method,
              url: request.url,
              // Including the headers in the log could be in violation of privacy laws, e.g. GDPR.
              // headers: request.headers,
            };
          },
          res(reply: ServerResponse) {
            return {
              statusCode: reply.statusCode,
            };
          },
        },
        transport:
          NODE_ENV !== NodeEnv.PRODUCTION
            ? {
                target: 'pino-pretty',
                options: {
                  translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
                },
              }
            : null,
      },
    };
  }
}

export class Config {
  private DB_URL: string; // Define private properties for DB_URL and JWT_SECRET
  private JWT_SECRET: string;

  constructor(private configService: ConfigService) {
    this.DB_URL = this.configService.get<string>('DB_URL');
    this.JWT_SECRET = this.configService.get<string>('JWT_SECRET');
  }

  getDbUrl(): string {
    return this.DB_URL;
  }

  getJwtSecret(): string {
    return this.JWT_SECRET;
  }
}
