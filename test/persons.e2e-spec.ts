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

const login = async (
  app: INestApplication,
  email: string,
  password: string,
) => {
  const response = await request(app.getHttpServer())
    .post('/auth')
    .send({ email, password });

  return response.body.accessToken;
};

const createUserAndLogin = async (app: INestApplication) => {
  const name = 'Any User';
  const email = 'anyuser@email.com';
  const password = '123456';

  await request(app.getHttpServer()).post('/persons').send({
    name,
    email,
    password,
  });

  return login(app, email, password);
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

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

    authToken = await createUserAndLogin(app);
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

  describe('/persons/:id (GET)', () => {
    it('should return Unauthorized when user is not logged in', async () => {
      const personResponse = await request(app.getHttpServer())
        .post('/persons')
        .send({
          email: 'pedro@email.com',
          password: '123456',
          name: 'Pedro',
        })
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .get('/persons/' + personResponse.body.id)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual({
        message: 'It was not logged in!',
        error: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('should return the person when user is logged in', async () => {
      const createPersonDto: CreatePersonDto = {
        email: 'pedro@email.com',
        password: '123456',
        name: 'Pedro',
      };

      const personResponse = await request(app.getHttpServer())
        .post('/persons')
        .send({ ...createPersonDto })
        .expect(HttpStatus.CREATED);

      //const accessToken = await createUserAndLogin(app);

      const response = await request(app.getHttpServer())
        .get('/persons/' + personResponse.body.id)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

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
