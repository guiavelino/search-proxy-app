import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { validationPipeConfig } from './search/search.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(validationPipeConfig());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  Logger.log(`Server running on port ${port}`, 'Bootstrap');
}

bootstrap().catch((error) => {
  Logger.error('Failed to start application', error, 'Bootstrap');
  process.exit(1);
});
