/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('DeeList API')
    .setDescription('DeeList backend API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  const port = process.env.PORT || 3000;

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );

  Logger.log(
    `📚 Swagger documentation available at: http://localhost:${port}/${globalPrefix}/docs`,
  );
}

bootstrap();
