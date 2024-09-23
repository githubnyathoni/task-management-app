import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.setGlobalPrefix('/v1/api');
  app.enableCors({
    origin: 'http://localhost:5173',
  });

  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API documentation with Zod validation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/v1/docs', app, document);

  await app.listen(3000);
}
bootstrap();
