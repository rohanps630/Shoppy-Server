import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV } from './env';
import { MicroserviceEnvVariables } from './microserviceFactory.factory';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface'; // Import MongooseModuleFactoryOptions
import { LoggerModule } from './common/logger/logger.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV.envFileName(),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<MongooseModuleFactoryOptions> => ({
        uri: new MicroserviceEnvVariables(configService).MONGODB_DB_URL,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    LoggerModule,
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
