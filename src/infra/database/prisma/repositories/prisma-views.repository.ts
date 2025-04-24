import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import {
  CountByProduct,
  CountBySeller,
  ViewsPerDay,
  ViewsRepository,
} from '@domain/marketplace/application/repositories/views.repository';
import { View } from '@domain/marketplace/enterprise/entities/view';

import { PrismaViewsMapper } from '@infra/database/prisma/mappers/prisma-views.mapper';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class PrismaViewsRepository implements ViewsRepository {
  constructor(private prisma: PrismaService) {}

  async countByProduct(params: CountByProduct): Promise<number> {
    const amount = await this.prisma.view.count({
      where: {
        productId: params.productId,
        createdAt: { gte: params.from },
      },
    });

    return amount;
  }

  async countPerDay(params: CountBySeller): Promise<ViewsPerDay[]> {
    const raw = await this.prisma.$queryRaw<Array<{ date: string; amount: bigint }>>`
      SELECT
        strftime('%d/%m/%Y', DATETIME(ROUND(created_at / 1000), 'unixepoch')) as date,
        COUNT(*) as amount,
        created_at
      FROM "views"
      WHERE "product_id" IN (SELECT "id" FROM "products" WHERE "owner_id" = ${params.sellerId})
      AND "created_at" >= ${params.from.getTime()}
      GROUP BY date
      ORDER BY "created_at" ASC;
    `;

    const viewsPerDay: ViewsPerDay[] = [];

    for (let i = 0; i <= dayjs().diff(params.from, 'days'); i++) {
      const date = dayjs(params.from).add(i, 'days');
      const formattedDate = date.format('DD/MM/YYYY');

      const view = raw.find((v) => v.date === formattedDate);

      viewsPerDay.push({
        date: dayjs(date).toDate(),
        amount: view ? Number(view.amount) : 0,
      });
    }

    return viewsPerDay;
  }

  async countBySeller(params: CountBySeller): Promise<number> {
    const amount = await this.prisma.view.count({
      where: {
        product: { ownerId: params.sellerId },
        createdAt: { gte: params.from },
      },
    });

    return amount;
  }

  async isViewed(view: View): Promise<boolean> {
    const viewed = await this.prisma.view.findUnique({
      where: {
        viewerId_productId: {
          viewerId: view.viewer.id.toString(),
          productId: view.product.id.toString(),
        },
      },
    });

    return !!viewed;
  }

  async create(view: View): Promise<View> {
    await this.prisma.view.create({ data: PrismaViewsMapper.toCreate(view) });

    return view;
  }
}
