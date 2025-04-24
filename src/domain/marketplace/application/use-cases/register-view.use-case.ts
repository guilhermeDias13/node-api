import { Injectable } from '@nestjs/common';

import { NotAllowedError } from '@core/errors/common/not-allowed.error';
import { Either, left, right } from '@core/logic/either';

import { ProductsRepository } from '@domain/marketplace/application/repositories/products.repository';
import { ViewersRepository } from '@domain/marketplace/application/repositories/viewers.repository';
import { ViewsRepository } from '@domain/marketplace/application/repositories/views.repository';
import { ResourceNotFoundError } from '@domain/marketplace/application/use-cases/errors/resource-not-found.error';
import { View } from '@domain/marketplace/enterprise/entities/view';

interface Params {
  productId: string;
  viewerId: string;
}

type Result = Either<ResourceNotFoundError | NotAllowedError, { view: View }>;

@Injectable()
export class RegisterViewUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private viewersRepository: ViewersRepository,
    private viewsRepository: ViewsRepository,
  ) {}

  async execute(params: Params): Promise<Result> {
    const [product, viewer] = await Promise.all([
      this.productsRepository.findById(params.productId),
      this.viewersRepository.findById(params.viewerId),
    ]);

    if (!product) {
      return left(new ResourceNotFoundError('Product', 'ID', params.productId));
    }

    if (!viewer) {
      return left(new ResourceNotFoundError('Viewer', 'ID', params.viewerId));
    }

    if (product.owner.equals(viewer)) {
      return left(new NotAllowedError('Views cannot be registered by the product owner'));
    }

    const view = View.create({ product, viewer });
    const isViewed = await this.viewsRepository.isViewed(view);

    if (isViewed) {
      return right({ view });
    } else {
      await this.viewsRepository.create(view);
    }

    return right({ view });
  }
}
