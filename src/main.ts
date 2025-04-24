import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import expressListRoutes from 'express-list-routes';
import { patchNestJsSwagger } from 'nestjs-zod';

import { EnvService } from '@infra/env/env.service';
import { InfraModule } from '@infra/infra.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(InfraModule);
  patchNestJsSwagger();

  const config = new DocumentBuilder()
    .setTitle('MBA Marketplace API')
    .setDescription('API to manage MBA Marketplace')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({ credentials: true, origin: true });
  app.use(cookieParser());

  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);

  expressListRoutes(app.getHttpAdapter().getInstance(), {
    logger: (method, space, path) => logger.debug(`${method} ${space}${path}`),
  });
}
bootstrap();
