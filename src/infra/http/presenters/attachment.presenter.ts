import { z } from 'nestjs-zod/z';

import { Attachment as AttachmentEntity } from '@domain/marketplace/enterprise/entities/attachment';

import { EnvService } from '@infra/env/env.service';

const schema = z.object({
  id: z.string().uuid(),
  url: z.string(),
});

export class AttachmentPresenter {
  static zod = schema;

  static toHTTP(envService: EnvService, attachment: AttachmentEntity) {
    const baseUrl = envService.get('ATTACHMENTS_BASE_URL');

    return {
      id: attachment.id.toString(),
      url: `${baseUrl}/${attachment.path}`,
    };
  }
}
