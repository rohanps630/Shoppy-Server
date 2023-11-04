import { ExceptionFilter, INestApplication, INestMicroservice, NestInterceptor, PipeTransform, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { LoggerService } from '@common/logger/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthInfo } from '@common/base.request';
import { MessagingBroker } from '@common/enums/messaging-broker.enums';
// import { SASLOptions } from '@nestjs/microservices/external/kafka.interface';
// import { ClientProxy, ClientProxyFactory, MicroserviceOptions, Transport } from '@nestjs/microservices';

export class MicroserviceEnvKeys {
  public static readonly SERVICE_PORT = 'SERVICE_PORT';
  public static readonly SERVICE_IDENTIFIER = 'SERVICE_IDENTIFIER';
  public static readonly SERVICE_NAME = 'SERVICE_NAME';
  public static readonly SERVICE_DESCRIPTION = 'SERVICE_DESCRIPTION';
  public static readonly SERVICE_PATH = 'SERVICE_PATH';
  public static readonly SERVICE_VERSION = 'SERVICE_VERSION';
  public static readonly SERVICE_BASE_URL = 'SERVICE_BASE_URL';

  public static readonly MONGODB_HOST = 'MONGODB_HOST';
  public static readonly MONGODB_PORT = 'MONGODB_PORT';
  public static readonly MONGODB_USERNAME = 'MONGODB_USERNAME';
  public static readonly MONGODB_PASSWORD = 'MONGODB_PASSWORD';
  public static readonly MONGODB_DB_NAME = 'MONGODB_DB_NAME';
  public static readonly MONGODB_DB_URL = 'MONGODB_DB_URL';

  public static readonly MESSAGING_BROKER_OPTION = 'MESSAGING_BROKER_OPTION';

  // public static readonly KAFKA_BROKERS = 'KAFKA_BROKERS';
  // public static readonly KAFKA_BROKERS_USERNAME = 'KAFKA_BROKERS_USERNAME';
  // public static readonly KAFKA_BROKERS_PASSWORD = 'KAFKA_BROKERS_PASSWORD';

  public static readonly JWT_SECRET = 'JWT_SECRET';
  public static readonly JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET';
}

export class MicroserviceEnvVariables {
  public readonly SERVICE_PORT: number;
  public readonly SERVICE_IDENTIFIER: string;
  public readonly SERVICE_NAME: string;
  public readonly SERVICE_DESCRIPTION: string;
  public readonly SERVICE_PATH: string;
  public readonly SERVICE_VERSION: string;
  public readonly SERVICE_BASE_URL: string;

  public readonly MONGODB_HOST: string;
  public readonly MONGODB_PORT: number;
  public readonly MONGODB_USERNAME: string;
  public readonly MONGODB_PASSWORD: string;
  public readonly MONGODB_DB_NAME: string;
  public readonly MONGODB_DB_URL: string;

  public readonly MESSAGING_BROKER_OPTION: string;

  // public readonly KAFKA_BROKERS: string[];
  // public readonly KAFKA_BROKERS_USERNAME: string;
  // public readonly KAFKA_BROKERS_PASSWORD: string;

  public readonly JWT_SECRET: string;
  public readonly JWT_REFRESH_SECRET: string;

  constructor(configService: ConfigService) {
    this.SERVICE_PORT = configService.get<number>(MicroserviceEnvKeys.SERVICE_PORT);
    this.SERVICE_IDENTIFIER = configService.get<string>(MicroserviceEnvKeys.SERVICE_IDENTIFIER);
    this.SERVICE_NAME = configService.get<string>(MicroserviceEnvKeys.SERVICE_NAME);
    this.SERVICE_DESCRIPTION = configService.get<string>(MicroserviceEnvKeys.SERVICE_DESCRIPTION);
    this.SERVICE_PATH = configService.get<string>(MicroserviceEnvKeys.SERVICE_PATH);
    this.SERVICE_VERSION = configService.get<string>(MicroserviceEnvKeys.SERVICE_PATH);
    this.SERVICE_BASE_URL = configService.get<string>(MicroserviceEnvKeys.SERVICE_BASE_URL);

    this.MONGODB_HOST = configService.get<string>(MicroserviceEnvKeys.MONGODB_HOST);
    this.MONGODB_PORT = configService.get<number>(MicroserviceEnvKeys.MONGODB_PORT);
    this.MONGODB_USERNAME = configService.get<string>(MicroserviceEnvKeys.MONGODB_USERNAME);
    this.MONGODB_PASSWORD = configService.get<string>(MicroserviceEnvKeys.MONGODB_PASSWORD);
    this.MONGODB_DB_NAME = configService.get<string>(MicroserviceEnvKeys.MONGODB_DB_NAME);
    this.MONGODB_DB_URL = configService.get<string>(MicroserviceEnvKeys.MONGODB_DB_URL);

    this.MESSAGING_BROKER_OPTION = configService.get<string>(MicroserviceEnvKeys.MESSAGING_BROKER_OPTION);

    // this.KAFKA_BROKERS = configService.get<string>(MicroserviceEnvKeys.KAFKA_BROKERS).split(',');
    // this.KAFKA_BROKERS_USERNAME = configService.get<string>(MicroserviceEnvKeys.KAFKA_BROKERS_USERNAME);
    // this.KAFKA_BROKERS_PASSWORD = configService.get<string>(MicroserviceEnvKeys.KAFKA_BROKERS_PASSWORD);

    this.JWT_SECRET = configService.get<string>(MicroserviceEnvKeys.JWT_SECRET);
    this.JWT_REFRESH_SECRET = configService.get<string>(MicroserviceEnvKeys.JWT_REFRESH_SECRET);
  }
}

// export class KafkaSasl {
//   static of(envVariables: MicroserviceEnvVariables): SASLOptions {
//     const kafkaUsername = envVariables.KAFKA_BROKERS_USERNAME;
//     const kafkaPassword = envVariables.KAFKA_BROKERS_PASSWORD;

//     if (!kafkaUsername || !kafkaPassword) {
//       return null;
//     }

//     if (kafkaUsername.trim().length < 1 || kafkaPassword.trim().length < 1) {
//       return null;
//     }

//     return {
//       mechanism: 'plain',
//       username: kafkaUsername,
//       password: kafkaPassword,
//     };
//   }
// }

// class KafkaMicroservice {
//   static of(app: INestApplication, envVariables: MicroserviceEnvVariables): INestMicroservice {
//     const serviceIdentifier = envVariables.SERVICE_IDENTIFIER;
//     const kafkaBrokers = envVariables.KAFKA_BROKERS;

//     return app.connectMicroservice<MicroserviceOptions>({
//       transport: Transport.KAFKA,
//       options: {
//         client: {
//           brokers: kafkaBrokers,
//           clientId: serviceIdentifier,
//           sasl: KafkaSasl.of(envVariables),
//         },
//         consumer: {
//           groupId: serviceIdentifier,
//         },
//       },
//     });
//   }
// }

// class RedisMicroservice {
//   static of(app: INestApplication, envVariables: MicroserviceEnvVariables): INestMicroservice {
//     const redisUrl = envVariables.REDIS_BROKERS;
//     const redisPassword = envVariables.REDIS_BROKERS_PASSWORD;

//     return app.connectMicroservice<MicroserviceOptions>({
//       transport: Transport.REDIS,
//       options: {
//         url: redisUrl,
//         auth_pass: redisPassword,
//       },
//     });
//   }
// }

export class MicroserviceFactory {
  private static _app: INestApplication;
  public static get app(): INestApplication {
    return MicroserviceFactory._app;
  }

  private static _envVariables: MicroserviceEnvVariables;
  public static get envVariables(): MicroserviceEnvVariables {
    return MicroserviceFactory._envVariables;
  }

  private static _loggerService: LoggerService;
  public static get loggerService(): LoggerService {
    return MicroserviceFactory._loggerService;
  }

  static async create(): Promise<INestApplication> {
    MicroserviceFactory._app = await NestFactory.create(AppModule);

    MicroserviceFactory._envVariables = new MicroserviceEnvVariables(MicroserviceFactory._app.get(ConfigService));
    MicroserviceFactory._loggerService = MicroserviceFactory._app.get(LoggerService);

    return MicroserviceFactory._app;
  }

  static async addProcessTitle() {
    process.title = MicroserviceFactory._envVariables.SERVICE_NAME;

    process.on('uncaughtException', function (e) {
      MicroserviceFactory._loggerService.error('MAIN uncaughtException', JSON.stringify(e));
    });

    process.on('UnhandledPromiseRejectionWarning', function (e) {
      MicroserviceFactory._loggerService.error('MAIN UnhandledPromiseRejectionWarning', e);
    });
  }

  static get<T = any>(t: Type<T> | string): T {
    return MicroserviceFactory._app.get(t);
  }

  static async addSwagger() {
    const serviceName = MicroserviceFactory._envVariables.SERVICE_NAME;
    const serviceDescription = MicroserviceFactory._envVariables.SERVICE_DESCRIPTION;
    const serviceVersion = MicroserviceFactory._envVariables.SERVICE_VERSION;
    const serviceBasePath = MicroserviceFactory._envVariables.SERVICE_PATH;

    const swaggerConfig = new DocumentBuilder()
      .setTitle(serviceName)
      .setDescription(serviceDescription)
      .setVersion(serviceVersion)
      .addTag(serviceName)
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        AuthInfo.JWT_AUTH_KEY,
      )
      .build();

    const document = SwaggerModule.createDocument(MicroserviceFactory._app, swaggerConfig);

    SwaggerModule.setup(serviceBasePath + '/docs', MicroserviceFactory._app, document);
  }

  static async addGlobalFilters(filter: ExceptionFilter) {
    MicroserviceFactory._app.useGlobalFilters(filter);
  }

  static async addGlobalInterceptors(interceptor: NestInterceptor) {
    MicroserviceFactory._app.useGlobalInterceptors(interceptor);
  }

  static async useGlobalPipes(pipe: PipeTransform<any>) {
    MicroserviceFactory._app.useGlobalPipes(pipe);
  }

  // private static _kafkaMessageBrokerClient: ClientProxy;

  // public static async getKafkaMessageBrokerClient(): Promise<ClientProxy> {
  //   if (MicroserviceFactory._kafkaMessageBrokerClient) {
  //     return MicroserviceFactory._kafkaMessageBrokerClient;
  //   }

  //   const serviceIdentifier = MicroserviceFactory.envVariables.SERVICE_IDENTIFIER;
  //   // const kafkaBrokers = MicroserviceFactory.envVariables.KAFKA_BROKERS;

  //   MicroserviceFactory._kafkaMessageBrokerClient = ClientProxyFactory.create({
  //     transport: Transport.KAFKA,

  //     options: {
  //       client: {
  //         clientId: serviceIdentifier,
  //         brokers: kafkaBrokers,
  //         sasl: KafkaSasl.of(MicroserviceFactory._envVariables),
  //       },
  //       consumer: {
  //         groupId: serviceIdentifier,
  //       },
  //     },
  //   });

  //   return MicroserviceFactory._kafkaMessageBrokerClient;
  // }

  static async addMicroservices() {
    const messagingBrokerOption = MicroserviceFactory._envVariables.MESSAGING_BROKER_OPTION;

    let microservice: INestMicroservice;

    if (messagingBrokerOption == MessagingBroker.KAFKA) {
      // microservice = KafkaMicroservice.of(MicroserviceFactory._app, MicroserviceFactory._envVariables);
    } else if (messagingBrokerOption == MessagingBroker.REDIS) {
      // microservice = RedisMicroservice.of(MicroserviceFactory._app, MicroserviceFactory._envVariables);
    }

    if (microservice) {
      await MicroserviceFactory._app.startAllMicroservices();
    }
  }

  static async setGlobalPrefix() {
    const serviceBasePath = MicroserviceFactory._envVariables.SERVICE_PATH;
    MicroserviceFactory._app.setGlobalPrefix(serviceBasePath);
  }

  static async enableCors() {
    MicroserviceFactory._app.enableCors();
  }

  static async listen() {
    const port = MicroserviceFactory._envVariables.SERVICE_PORT;

    MicroserviceFactory._app.listen(port, () => {
      MicroserviceFactory._loggerService.log(`Microservice is listening on ${port}`);
    });
  }
}
