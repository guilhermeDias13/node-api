import { z } from 'nestjs-zod/z';

import { Category } from '@domain/marketplace/enterprise/entities/category';

const schema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
});

export class CategoryPresenter {
  static zod = schema;

  static toHTTP(category: Category) {
    return {
      id: category.id.toString(),
      title: category.title,
      slug: category.slug,
    };
  }
}
