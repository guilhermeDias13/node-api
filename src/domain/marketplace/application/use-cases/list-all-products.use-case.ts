import { Injectable } from '@nestjs/common';

import { Either, right } from '@core/logic/either';

import { ProductsRepository } from '@domain/marketplace/application/repositories/products.repository';
import { Product } from '@domain/marketplace/enterprise/entities/product';

interface Params {
  page: number;
  search?: string;
  status?: Product['status'];
}

type Result = Either<null, { products: Product[] }>;

@Injectable()
export class ListAllProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(params: Params): Promise<Result> {
    const products = await this.productsRepository.findMany({
      page: params.page,
      search: params.search,
      status: params.status,
    });

    return right({ products });
  }
}
