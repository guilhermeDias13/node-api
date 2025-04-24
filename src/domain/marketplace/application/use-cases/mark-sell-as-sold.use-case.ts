import { Injectable } from '@nestjs/common';

import { NotAllowedError } from '@core/errors/common/not-allowed.error';
import { Either, left, right } from '@core/logic/either';

import { ProductsRepository } from '@domain/marketplace/application/repositories/products.repository';
import { SellersRepository } from '@domain/marketplace/application/repositories/sellers.repository';
import { ResourceNotFoundError } from '@domain/marketplace/application/use-cases/errors/resource-not-found.error';
import { Product } from '@domain/marketplace/enterprise/entities/product';

interface Params {
  productId: string;
  ownerId: string;
}

type Result = Either<ResourceNotFoundError | NotAllowedError, { product: Product }>;

@Injectable()
export class MarkSellAsSoldUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute(params: Params): Promise<Result> {
    const [seller, product] = await Promise.all([
      this.sellersRepository.findById(params.ownerId),
      this.productsRepository.findById(params.productId),
    ]);

    if (!seller) {
      return left(new ResourceNotFoundError('Seller', 'ID', params.ownerId));
    }

    if (!product) {
      return left(new ResourceNotFoundError('Product', 'ID', params.productId));
    }

    if (!product.owner.id.equals(seller.id)) {
      return left(new NotAllowedError('You are not the owner of this product.'));
    }

    if (product.status === Product.Status.SOLD) {
      return left(new NotAllowedError('This product is already sold.'));
    }

    if (product.status === Product.Status.CANCELLED) {
      return left(new NotAllowedError('You cannot sell a cancelled product.'));
    }

    product.status = Product.Status.SOLD;

    await this.productsRepository.save(product);

    return right({ product });
  }
}
