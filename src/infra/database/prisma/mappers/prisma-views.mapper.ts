import { Prisma } from '@prisma/client';

import { View } from '@domain/marketplace/enterprise/entities/view';

export class PrismaViewsMapper {
  static toCreate(view: View): Prisma.ViewUncheckedCreateInput {
    return {
      id: view.product.id.toString(),
      productId: view.product.id.toString(),
      viewerId: view.viewer.id.toString(),
      createdAt: view.createdAt,
    };
  }
}
