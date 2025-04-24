import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@core/logic/either';

import { ProductsRepository } from '@domain/marketplace/application/repositories/products.repository';
import { ResourceNotFoundError } from '@domain/marketplace/application/use-cases/errors/resource-not-found.error';
import { Product } from '@domain/marketplace/enterprise/entities/product';

interface Params {
  id: string;
}

type Result = Either<ResourceNotFoundError, { product: Product }>;

@Injectable()
export class GetProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(params: Params): Promise<Result> {
    const product = await this.productsRepository.findById(params.id);

    if (!product) {
      return left(new ResourceNotFoundError('Product', 'ID', params.id));
    }

    return right({ product });
  }
}
