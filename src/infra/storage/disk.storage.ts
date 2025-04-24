import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { resolve } from 'path';

import { Uploader, UploadParams } from '@domain/marketplace/application/storage/uploader';

@Injectable()
export class DiskStorage implements Uploader {
  async upload(params: UploadParams): Promise<{ path: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${params.file.name}`;

    const tmpPath = resolve(process.cwd(), 'temp', uniqueFileName);

    await mkdir(resolve(process.cwd(), 'temp'), { recursive: true });
    await writeFile(tmpPath, Buffer.from(await params.file.arrayBuffer()));

    return {
      path: `${uniqueFileName}`,
    };
  }
}
