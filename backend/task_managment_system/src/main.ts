import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  // Enable CORS with the appropriate settings
  app.enableCors({
    origin: ['http://127.0.0.1:5501', 'http://localhost:5501'], // Allow frontend to make requests to backend
    methods: 'POST, DELETE, PATCH, GET', 
    allowedHeaders: 'Content-Type, Authorization', // Allow Content-Type and Authorization headers
  });

  // Enable global pipes for validation and interceptors
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}

bootstrap();
