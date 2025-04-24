import { z } from 'nestjs-zod/z';

import { User } from '@domain/marketplace/enterprise/entities/user/user';

import { EnvService } from '@infra/env/env.service';
import { AttachmentPresenter } from '@infra/http/presenters/attachment.presenter';

export class UserPresenter {
  static zod = z.object({
    id: z.string().uuid(),
    name: z.string(),
    phone: z.string(),
    email: z.string().email(),
    avatar: AttachmentPresenter.zod.nullable(),
  });

  static toHTTP(envService: EnvService, seller: User) {
    return {
      id: seller.id.toString(),
      name: seller.name,
      phone: seller.phone,
      email: seller.email,
      avatar: seller.avatar
        ? AttachmentPresenter.toHTTP(envService, seller.avatar)
        : null,
    };
  }
}
