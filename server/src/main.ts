import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Flutter web and Next.js
  app.enableCors({
    origin: ['http://localhost:9999', 'http://localhost:8080', 'http://localhost:3000', 'http://localhost:3002', 'http://localhost:3003'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 9999;
  await app.listen(port);
  console.log(`?? Server running on http://localhost:${port}`);
}
bootstrap();
