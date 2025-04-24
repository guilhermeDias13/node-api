import { Injectable } from '@nestjs/common';

import { AsyncMaybe } from '@core/logic/maybe';

import { SellersRepository } from '@domain/marketplace/application/repositories/sellers.repository';
import { Seller } from '@domain/marketplace/enterprise/entities/user/seller';

import { PrismaSellerMapper } from '@infra/database/prisma/mappers/prisma-seller.mapper';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class PrismaSellersRepository implements SellersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): AsyncMaybe<Seller> {
    const seller = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        avatar: true,
      },
    });

    if (!seller) return null;

    return PrismaSellerMapper.toDomain(seller);
  }

  async findByEmail(email: string): AsyncMaybe<Seller> {
    const seller = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        avatar: true,
      },
    });

    if (!seller) return null;

    return PrismaSellerMapper.toDomain(seller);
  }

  async findByPhone(phone: string): AsyncMaybe<Seller> {
    const seller = await this.prisma.user.findUnique({
      where: {
        phone,
      },
      include: {
        avatar: true,
      },
    });

    if (!seller) return null;

    return PrismaSellerMapper.toDomain(seller);
  }

  async save(seller: Seller): Promise<Seller> {
    const data = PrismaSellerMapper.toUpdate(seller);

    await this.prisma.user.update({
      where: { id: seller.id.toString() },
      data,
    });

    return seller;
  }

  async create(seller: Seller): Promise<Seller> {
    const data = PrismaSellerMapper.toCreate(seller);

    await this.prisma.user.create({ data });

    return seller;
  }
}
