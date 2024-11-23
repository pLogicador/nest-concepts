import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes keys not in the DTO
      forbidNonWhitelisted: true, // raise error when key does not exist
      transform: false, // tries to transform the data types of param and dtos
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
