import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const corsOriginsEnv = process.env.CORS_ORIGINS; // e.g. "http://localhost:3000,http://localhost:4200"
  const allowedOrigins = corsOriginsEnv
    ? corsOriginsEnv
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean)
    : ['*'];

  const isWildcard = allowedOrigins.length === 1 && allowedOrigins[0] === '*';

  app.enableCors({
    origin: isWildcard ? '*' : allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: !isWildcard,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
      validateCustomDecorators: true, // Validate custom decorators
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`🚀 Frituur Ordering System Backend running on port ${port}`);
  logger.log(`📡 WebSocket server ready for real-time connections`);
  logger.log(`🌐 API available at http://localhost:${port}`);
}
bootstrap();
