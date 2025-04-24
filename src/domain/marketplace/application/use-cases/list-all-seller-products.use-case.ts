import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@core/logic/either';

import { ProductsRepository } from '@domain/marketplace/application/repositories/products.repository';
import { SellersRepository } from '@domain/marketplace/application/repositories/sellers.repository';
import { ResourceNotFoundError } from '@domain/marketplace/application/use-cases/errors/resource-not-found.error';
import { Product } from '@domain/marketplace/enterprise/entities/product';

interface Params {
  sellerId: string;
  search?: string;
  status?: Product['status'];
}

type Result = Either<ResourceNotFoundError, { products: Product[] }>;

@Injectable()
export class ListAllSellerProductsUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute(params: Params): Promise<Result> {
    const seller = await this.sellersRepository.findById(params.sellerId);

    if (!seller) {
      return left(new ResourceNotFoundError('Seller', 'ID', params.sellerId));
    }

    const products = await this.productsRepository.findManyByOwner({
      ownerId: params.sellerId,
      search: params.search,
      status: params.status,
    });

    return right({ products });
  }
}
