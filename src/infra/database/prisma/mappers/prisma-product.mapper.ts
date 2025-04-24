import {
  Prisma,
  User as PrismaUser,
  Product as PrismaProduct,
  Category as PrismaCategory,
  Attachment as PrismaAttachment,
} from '@prisma/client';

import { UniqueEntityID } from '@core/entities/unique-entity-id';

import { Product } from '@domain/marketplace/enterprise/entities/product';

import { PrismaAttachmentMapper } from '@infra/database/prisma/mappers/prisma-attachment.mapper';
import { PrismaCategoryMapper } from '@infra/database/prisma/mappers/prisma-category.mapper';
import { PrismaSellerMapper } from '@infra/database/prisma/mappers/prisma-seller.mapper';

type Raw = PrismaProduct & {
  category?: PrismaCategory;
  owner?: PrismaUser;
  attachments?: PrismaAttachment[];
};

export class PrismaProductMapper {
  static toDomain(raw: Raw): Product {
    if (!raw.category) {
      throw new Error('Category is required');
    }

    if (!raw.owner) {
      throw new Error('Owner is required');
    }

    if (!raw.attachments) {
      throw new Error('Attachments are required');
    }

    return Product.create(
      {
        title: raw.title,
        description: raw.description,
        createdAt: raw.createdAt,
        status: raw.status as Product['status'],
        priceInCents: raw.priceInCents,
        category: PrismaCategoryMapper.toDomain(raw.category),
        owner: PrismaSellerMapper.toDomain(raw.owner),
        attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toCreate(product: Product): Prisma.ProductCreateInput {
    return {
      id: product.id.toString(),
      category: {
        connect: {
          id: product.category.id.toString(),
        },
      },
      owner: {
        connect: {
          id: product.owner.id.toString(),
        },
      },
      description: product.description,
      priceInCents: product.priceInCents,
      status: product.status,
      title: product.title,
      createdAt: product.createdAt,
      attachments: {
        connect: product.attachments.getItems().map((attachment) => ({
          id: attachment.id.toString(),
          path: attachment.path,
        })),
      },
    };
  }

  static toUpdate(product: Product): Prisma.ProductUpdateInput {
    return {
      title: product.title,
      description: product.description,
      priceInCents: product.priceInCents,
      status: product.status,
      attachments: {
        connect: product.attachments.getNewItems().map((attachment) => ({
          id: attachment.id.toString(),
        })),
        disconnect: product.attachments.getRemovedItems().map((attachment) => ({
          id: attachment.id.toString(),
        })),
      },
      category: {
        connect: {
          id: product.category.id.toString(),
        },
      },
    };
  }
}
