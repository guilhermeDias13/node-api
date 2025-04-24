import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EnvService } from '@infra/env/env.service';
import { envSchema } from '@infra/env/schema';

@Module({
  imports: [ConfigModule.forRoot({ validate: envSchema.parse })],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
