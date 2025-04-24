import { Injectable } from '@nestjs/common';

import { Either, right } from '@core/logic/either';

import { AttachmentsRepository } from '@domain/marketplace/application/repositories/attachments.repository';
import { Uploader } from '@domain/marketplace/application/storage/uploader';
import { Attachment } from '@domain/marketplace/enterprise/entities/attachment';

interface Params {
  files: File[];
}

type Result = Either<null, { attachments: Attachment[] }>;

@Injectable()
export class UploadAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute(params: Params): Promise<Result> {
    const uploads = await Promise.all(
      params.files.map((file) => this.uploader.upload({ file })),
    );

    const attachments = uploads.map((upload) => {
      return Attachment.create({ path: upload.path });
    });

    await this.attachmentsRepository.createMany(attachments);

    return right({ attachments });
  }
}
