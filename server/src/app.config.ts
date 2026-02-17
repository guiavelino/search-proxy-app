import { ValidationPipe } from '@nestjs/common';

export function validationPipeConfig(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });
}
