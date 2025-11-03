import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
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

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`🚀 Frituur Ordering System Backend running on port ${port}`);
  logger.log(`📡 WebSocket server ready for real-time connections`);
  logger.log(`🌐 API available at http://localhost:${port}`);
}
bootstrap();
