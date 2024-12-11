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
      const createPersonDto = {
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
  });
});
