import { MicroserviceFactory } from './microserviceFactory.factory';
import { AllExceptionsFilter } from '@common/filters/exceptions.filter';
import { ResponseTransformInterceptor } from '@common/interceptors/transform.interceptor';
import { LoggerService } from '@common/logger/logger.service';
import { ValidationPipe } from '@common/pipes/validation.pipe';

async function bootstrap() {
  await MicroserviceFactory.create();
  await MicroserviceFactory.addProcessTitle();
  await MicroserviceFactory.addMicroservices();
  await MicroserviceFactory.setGlobalPrefix();
  await MicroserviceFactory.useGlobalPipes(new ValidationPipe());
  await MicroserviceFactory.enableCors();
  await MicroserviceFactory.addGlobalFilters(new AllExceptionsFilter(MicroserviceFactory.get(LoggerService)));
  await MicroserviceFactory.addGlobalInterceptors(new ResponseTransformInterceptor());
  await MicroserviceFactory.addSwagger();
  await MicroserviceFactory.listen();
}

bootstrap();
