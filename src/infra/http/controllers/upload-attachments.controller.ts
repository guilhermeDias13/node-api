import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { UploadAttachmentUseCase } from '@domain/marketplace/application/use-cases/upload-attachments.use-case';

import { EnvService } from '@infra/env/env.service';
import { Public } from '@infra/http/auth/public';
import { ApiMultiFile } from '@infra/http/decorators/api-multi-file';
import { AttachmentPresenter } from '@infra/http/presenters/attachment.presenter';

type MulterFile = Express.Multer.File;

class UploadAttachmentsResponse extends createZodDto(
  z.object({
    attachments: z.array(AttachmentPresenter.zod),
  }),
) {}

@ApiTags('Attachments')
@Controller('attachments')
export class UploadAttachmentsController {
  constructor(
    private uploadAttachment: UploadAttachmentUseCase,
    private env: EnvService,
  ) {}

  @Post()
  @Public()
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile()
  @ApiCreatedResponse({
    description: 'The attachments were successfully uploaded.',
    type: UploadAttachmentsResponse,
  })
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Upload attachments' })
  async handle(@UploadedFiles() files: MulterFile[]): Promise<UploadAttachmentsResponse> {
    const result = await this.uploadAttachment.execute({
      files: files.map(
        (file) => new File([file.buffer], file.originalname, { type: file.mimetype }),
      ),
    });

    if (result.isLeft()) throw result.value;

    return {
      attachments: result.value.attachments.map((attachment) => {
        return AttachmentPresenter.toHTTP(this.env, attachment);
      }),
    };
  }
}
