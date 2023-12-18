import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { EntityNotFoundErrorFilter } from './entity-not-found-error.filter';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new EntityNotFoundErrorFilter());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Survey Project')
    .setDescription('Survey API description')
    .setVersion('1.0')
    .addTag('surveys')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = 4000;
  await app.listen(PORT);
  logger.log(`Application running on port ${PORT}`);
}
bootstrap();

// nest g res name
