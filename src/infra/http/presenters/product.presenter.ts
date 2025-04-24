import { z } from 'nestjs-zod/z';

import { Product, ProductStatus } from '@domain/marketplace/enterprise/entities/product';

import { EnvService } from '@infra/env/env.service';
import { AttachmentPresenter } from '@infra/http/presenters/attachment.presenter';
import { CategoryPresenter } from '@infra/http/presenters/category.presenter';
import { UserPresenter } from '@infra/http/presenters/user.presenter';

export class ProductPresenter {
  static zod = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    priceInCents: z.number(),
    status: z.nativeEnum(ProductStatus),
    owner: UserPresenter.zod,
    category: CategoryPresenter.zod,
    attachments: z.array(AttachmentPresenter.zod),
  });

  static toHTTP(envService: EnvService, product: Product) {
    return {
      id: product.id.toString(),
      title: product.title,
      description: product.description,
      priceInCents: product.priceInCents,
      status: product.status,
      owner: UserPresenter.toHTTP(envService, product.owner),
      category: CategoryPresenter.toHTTP(product.category),
      attachments: product.attachments
        .getItems()
        .map((attachment) => AttachmentPresenter.toHTTP(envService, attachment)),
    };
  }
}
