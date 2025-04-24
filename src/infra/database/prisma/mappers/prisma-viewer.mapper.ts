import { User as PrismaUser, Attachment as PrismaAttachment } from '@prisma/client';

import { UniqueEntityID } from '@core/entities/unique-entity-id';

import { Viewer } from '@domain/marketplace/enterprise/entities/user/viewer';

import { PrismaAttachmentMapper } from '@infra/database/prisma/mappers/prisma-attachment.mapper';

type Raw = PrismaUser & {
  avatar?: PrismaAttachment | null;
};

export class PrismaViewerMapper {
  static toDomain(raw: Raw): Viewer {
    if (raw.avatar === undefined) {
      throw new Error('Avatar is required');
    }

    return Viewer.create(
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
}
