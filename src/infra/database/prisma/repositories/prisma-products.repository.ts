import { Injectable } from '@nestjs/common';

import { AsyncMaybe } from '@core/logic/maybe';

import {
  FindManyByOwner,
  ProductsRepository,
  Count,
  FindMany,
} from '@domain/marketplace/application/repositories/products.repository';
import { Product } from '@domain/marketplace/enterprise/entities/product';

import { PrismaProductMapper } from '@infra/database/prisma/mappers/prisma-product.mapper';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private prisma: PrismaService) {}

  async count(params: Count): Promise<number> {
    const count = await this.prisma.product.count({
      where: {
        ownerId: params.sellerId,
        status: params.status,
        createdAt: { gte: params.from },
      },
    });

    return count;
  }

  async findManyByOwner(params: FindManyByOwner): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        ownerId: params.ownerId,
        status: params.status,
        AND: [
          {
            OR: [
              { title: { contains: params.search } },
              { description: { contains: params.search } },
            ],
          },
        ],
      },
      include: {
        category: true,
        attachments: true,
        owner: { include: { avatar: true } },
      },
    });

    return products.map(PrismaProductMapper.toDomain);
  }

  async findMany(params: FindMany): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      take: 10,
      skip: (params.page - 1) * 10,
      orderBy: { createdAt: 'desc' },
      where: {
        status: params.status,
        AND: [
          {
            OR: [
              { title: { contains: params.search } },
              { description: { contains: params.search } },
            ],
          },
        ],
      },
      include: {
        category: true,
        attachments: true,
        owner: { include: { avatar: true } },
      },
    });

    return products.map(PrismaProductMapper.toDomain);
  }

  async findById(id: string): AsyncMaybe<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        attachments: true,
        owner: { include: { avatar: true } },
      },
    });

    if (!product) return null;

    return PrismaProductMapper.toDomain(product);
  }

  async create(product: Product): Promise<Product> {
    await this.prisma.product.create({ data: PrismaProductMapper.toCreate(product) });

    return product;
  }

  async save(product: Product): Promise<Product> {
    await this.prisma.product.update({
      where: { id: product.id.toString() },
      data: PrismaProductMapper.toUpdate(product),
    });

    return product;
  }
}
