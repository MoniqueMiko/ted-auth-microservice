import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const configService = context.get(ConfigService);

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: configService.get<string>('REDIS_HOST') || 'localhost',
      port: Number(configService.get<number>('REDIS_PORT')) || 6379,
      retryAttempts: 10,
      retryDelay: 3000,
    },
  });

  await app.listen();
  logger.log('Microservice is listening');
}

bootstrap().catch((err) => {
  logger.error('Error starting microservice', err);
});