import {
  User as PrismaUser,
  Attachment as PrismaAttachment,
  Prisma,
} from '@prisma/client';

import { UniqueEntityID } from '@core/entities/unique-entity-id';

import { Seller } from '@domain/marketplace/enterprise/entities/user/seller';

import { PrismaAttachmentMapper } from '@infra/database/prisma/mappers/prisma-attachment.mapper';

type Raw = PrismaUser & {
  avatar?: PrismaAttachment | null;
};

export class PrismaSellerMapper {
  static toDomain(raw: Raw): Seller {
    if (raw.avatar === undefined) {
      throw new Error('Avatar is required');
    }

    return Seller.create(
      {
        name: raw.name,
        email: raw.email,
        phone: raw.phone,
        password: raw.password,
        avatar: raw.avatar ? PrismaAttachmentMapper.toDomain(raw.avatar) : undefined,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toCreate(seller: Seller): Prisma.UserCreateInput {
    return {
      id: seller.id.toString(),
      email: seller.email,
      name: seller.name,
      password: seller.password,
      phone: seller.phone,
      avatar: seller.avatar
        ? { connect: { id: seller.avatar.id.toString() } }
        : undefined,
    };
  }

  static toUpdate(seller: Seller): Prisma.UserUpdateInput {
    return {
      id: seller.id.toString(),
      email: seller.email,
      name: seller.name,
      password: seller.password,
      phone: seller.phone,
      avatar: seller.avatar
        ? { connect: { id: seller.avatar.id.toString() } }
        : undefined,
    };
  }
}
