import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import globalConfig from 'src/global-config/global.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MessagesModule } from 'src/messages/messages.module';
import { PersonsModule } from 'src/persons/persons.module';
import { GlobalConfigModule } from 'src/global-config/global-config.module';
import { AuthModule } from 'src/auth/auth.module';
import * as path from 'path';
import appConfig from 'src/app/config/app.config';
import { CreatePersonDto } from 'src/persons/dto/create-person.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(globalConfig),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          database: 'testing',
          password: '55669',
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
        }),
        ServeStaticModule.forRoot({
          rootPath: path.resolve(__dirname, '..', '..', 'pictures'),
          serveRoot: '/pictures',
        }),
        MessagesModule,
        PersonsModule,
        GlobalConfigModule,
        AuthModule,
      ],
    }).compile();

    app = module.createNestApplication();

    appConfig(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/persons (POST)', () => {
    it('should create a person successfully', async () => {
      const createPersonDto: CreatePersonDto = {
        email: 'pedro@email.com',
        password: '123456',
        name: 'Pedro',
      };
      const response = await request(app.getHttpServer())
        .post('/persons')
        .send(createPersonDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        email: createPersonDto.email,
        passwordHash: expect.any(String),
        name: createPersonDto.name,
        active: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        picture: '',
        id: expect.any(Number),
      });
    });

    it('should generate an email error already exists', async () => {
      const createPersonDto: CreatePersonDto = {
        email: 'pedro@email.com',
        password: '123456',
        name: 'Pedro',
      };

      await request(app.getHttpServer())
        .post('/persons')
        .send(createPersonDto)
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post('/persons')
        .send(createPersonDto)
        .expect(HttpStatus.CONFLICT);

      //console.log(response.body.message);
      expect(response.body.message).toBe('Email already registered.');
    });

    it('should generate a short password error', async () => {
      const createPersonDto: CreatePersonDto = {
        email: 'pedro@email.com',
        password: '123',
        name: 'Pedro',
      };

      const response = await request(app.getHttpServer())
        .post('/persons')
        .send(createPersonDto)
        .expect(HttpStatus.BAD_REQUEST);

      //console.log(response.body.message);
      expect(response.body.message).toEqual([
        'password must be longer than or equal to 5 characters',
      ]);
      expect(response.body.message).toContain(
        'password must be longer than or equal to 5 characters',
      );
    });
  });
});
