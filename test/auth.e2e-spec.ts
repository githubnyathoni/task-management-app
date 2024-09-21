import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/v1/api');

    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /v1/api/auth/register', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/api/auth/register')
        .send({
          email: '',
          password: '',
          name: '',
          avatar: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/api/auth/register')
        .send({
          email: 'test@gmail.com',
          password: 'test',
          name: 'test',
          avatar: 'https://test.com/image.png',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe('test@gmail.com');
      expect(response.body.data.name).toBe('test');
    });

    it('should be rejected if email already exists', async () => {
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .post('/v1/api/auth/register')
        .send({
          email: '',
          password: '',
          name: '',
          avatar: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
});
