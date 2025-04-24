import { Injectable } from '@nestjs/common';

import { AsyncMaybe } from '@core/logic/maybe';

import { ViewersRepository } from '@domain/marketplace/application/repositories/viewers.repository';
import { Viewer } from '@domain/marketplace/enterprise/entities/user/viewer';

import { PrismaViewerMapper } from '@infra/database/prisma/mappers/prisma-viewer.mapper';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class PrismaViewersRepository implements ViewersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): AsyncMaybe<Viewer> {
    const viewer = await this.prisma.user.findUnique({
      where: { id },
      include: { avatar: true },
    });

    if (!viewer) return null;

    return PrismaViewerMapper.toDomain(viewer);
  }
}
