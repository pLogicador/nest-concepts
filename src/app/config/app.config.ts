import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';

export default (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes keys not in the DTO
      forbidNonWhitelisted: true, // raise error when key does not exist
      transform: false, // tries to transform the data types of param and dtos
    }),
    new ParseIntIdPipe(),
  );
  return app;
};
