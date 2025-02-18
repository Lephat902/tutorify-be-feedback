import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { GlobalExceptionsFilter } from './global-exception-filter';
import { QueueNames } from '@tutorify/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URI],
        queue: QueueNames.FEEDBACK,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  // Use the global exception filter
  app.useGlobalFilters(new GlobalExceptionsFilter());

  await app.listen();
}
bootstrap();
