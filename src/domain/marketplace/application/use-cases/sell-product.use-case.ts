import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@core/logic/either';

import { AttachmentsRepository } from '@domain/marketplace/application/repositories/attachments.repository';
import { CategoriesRepository } from '@domain/marketplace/application/repositories/categories.repository';
import { ProductsRepository } from '@domain/marketplace/application/repositories/products.repository';
import { SellersRepository } from '@domain/marketplace/application/repositories/sellers.repository';
import { ResourceNotFoundError } from '@domain/marketplace/application/use-cases/errors/resource-not-found.error';
import { Product } from '@domain/marketplace/enterprise/entities/product';

interface Params {
  ownerId: string;
  categoryId: string;
  title: string;
  description: string;
  priceInCents: number;
  attachmentsIds: string[];
}

type Result = Either<ResourceNotFoundError, { product: Product }>;

@Injectable()
export class SellProductUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private categoryRepository: CategoriesRepository,
    private productsRepository: ProductsRepository,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute(params: Params): Promise<Result> {
    const seller = await this.sellersRepository.findById(params.ownerId);

    if (!seller) {
      return left(new ResourceNotFoundError('Seller', 'ID', params.ownerId));
    }

    const category = await this.categoryRepository.findById(params.categoryId);

    if (!category) {
      return left(new ResourceNotFoundError('Category', 'ID', params.categoryId));
    }

    const attachments = await this.attachmentsRepository.findManyByIds(
      params.attachmentsIds,
    );

    if (attachments.inexistentIds.length) {
      return left(
        new ResourceNotFoundError(
          'Attachment',
          'IDs',
          attachments.inexistentIds.join(', '),
        ),
      );
    }

    const product = Product.create({
      owner: seller,
      title: params.title,
      description: params.description,
      priceInCents: params.priceInCents,
      attachments: attachments.data,
      category,
    });

    await this.productsRepository.create(product);

    return right({ product });
  }
}
