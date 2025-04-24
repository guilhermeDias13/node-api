import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { ExceptionsFilter } from '@infra/exceptions.filter';
import { HttpModule } from '@infra/http/http.module';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class InfraModule {}
