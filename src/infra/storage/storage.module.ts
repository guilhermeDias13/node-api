import { Module } from '@nestjs/common';

import { Uploader } from '@domain/marketplace/application/storage/uploader';

import { EnvModule } from '@infra/env/env.module';
import { DiskStorage } from '@infra/storage/disk.storage';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: DiskStorage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
