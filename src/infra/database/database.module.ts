import { Module } from '@nestjs/common';

import { AttachmentsRepository } from '@domain/marketplace/application/repositories/attachments.repository';
import { CategoriesRepository } from '@domain/marketplace/application/repositories/categories.repository';
import { ProductsRepository } from '@domain/marketplace/application/repositories/products.repository';
import { SellersRepository } from '@domain/marketplace/application/repositories/sellers.repository';
import { ViewersRepository } from '@domain/marketplace/application/repositories/viewers.repository';
import { ViewsRepository } from '@domain/marketplace/application/repositories/views.repository';

import { PrismaService } from '@infra/database/prisma/prisma.service';
import { PrismaAttachmentsRepository } from '@infra/database/prisma/repositories/prisma-attachments.repository';
import { PrismaCategoriesRepository } from '@infra/database/prisma/repositories/prisma-categories.repository';
import { PrismaProductsRepository } from '@infra/database/prisma/repositories/prisma-products.repository';
import { PrismaSellersRepository } from '@infra/database/prisma/repositories/prisma-sellers.repository';
import { PrismaViewersRepository } from '@infra/database/prisma/repositories/prisma-viewers.repository';
import { PrismaViewsRepository } from '@infra/database/prisma/repositories/prisma-views.repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: SellersRepository,
      useClass: PrismaSellersRepository,
    },
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: ViewsRepository,
      useClass: PrismaViewsRepository,
    },
    {
      provide: ViewersRepository,
      useClass: PrismaViewersRepository,
    },
  ],
  exports: [
    PrismaService,
    SellersRepository,
    CategoriesRepository,
    ProductsRepository,
    AttachmentsRepository,
    ViewersRepository,
    ViewsRepository,
  ],
})
export class DatabaseModule {}
