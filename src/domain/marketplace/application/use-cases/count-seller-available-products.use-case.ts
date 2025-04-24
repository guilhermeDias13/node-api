import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@core/logic/either';

import { ProductsRepository } from '@domain/marketplace/application/repositories/products.repository';
import { SellersRepository } from '@domain/marketplace/application/repositories/sellers.repository';
import { ResourceNotFoundError } from '@domain/marketplace/application/use-cases/errors/resource-not-found.error';
import { ProductStatus } from '@domain/marketplace/enterprise/entities/product';

interface Params {
  sellerId: string;
  from: Date;
}

type Result = Either<ResourceNotFoundError, { amount: number }>;

@Injectable()
export class CountSellerAvailableProductsUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute(params: Params): Promise<Result> {
    const seller = await this.sellersRepository.findById(params.sellerId);

    if (!seller) {
      return left(new ResourceNotFoundError('Seller', 'ID', params.sellerId));
    }

    const amount = await this.productsRepository.count({
      sellerId: params.sellerId,
      from: params.from,
      status: ProductStatus.AVAILABLE,
    });

    return right({ amount });
  }
}
