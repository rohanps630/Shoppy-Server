import { AppConfig, AppModule } from '@mod/app';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { clusterize } from '@util/clustering';
import { initialize } from '@util/helper';
import { PinoLogger } from 'nestjs-pino';

const logger = new PinoLogger(AppConfig.getLoggerConfig());

const { CLUSTERING, PORT } = process.env;

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    AppConfig.getExpressInstance(),
    { bufferLogs: true }
  );

  initialize(app);

  app.listen(PORT, () => {
    logger.info(`App is listening on port ${PORT}`);
  });
};
if (CLUSTERING === 'true') clusterize(bootstrap);
else bootstrap();
