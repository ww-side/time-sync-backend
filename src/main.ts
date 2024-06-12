import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000'],
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
