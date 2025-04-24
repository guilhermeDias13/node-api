import { Injectable } from '@nestjs/common';

import { AsyncMaybe } from '@core/logic/maybe';

import {
  AsyncFindMany,
  AttachmentsRepository,
} from '@domain/marketplace/application/repositories/attachments.repository';
import { Attachment } from '@domain/marketplace/enterprise/entities/attachment';

import { PrismaAttachmentMapper } from '@infra/database/prisma/mappers/prisma-attachment.mapper';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByIds(ids: string[]): AsyncFindMany<Attachment> {
    const raws = await this.prisma.attachment.findMany({
      where: { id: { in: ids } },
    });

    const hasAll = ids.length === raws.length;

    const inexistentIds = ids.filter((id) => !raws.some((raw) => raw.id === id));

    return {
      hasAll,
      inexistentIds,
      data: raws.map(PrismaAttachmentMapper.toDomain),
    };
  }

  async findById(id: string): AsyncMaybe<Attachment> {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
    });

    if (!attachment) return null;

    return PrismaAttachmentMapper.toDomain(attachment);
  }

  async create(attachment: Attachment): Promise<Attachment> {
    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPersistence(attachment),
    });

    return attachment;
  }

  async createMany(attachments: Attachment[]): Promise<Attachment[]> {
    await this.prisma.attachment.createMany({
      data: attachments.map(PrismaAttachmentMapper.toPersistence),
    });

    return attachments;
  }
}
