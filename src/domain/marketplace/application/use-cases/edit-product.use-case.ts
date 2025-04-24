import { Injectable } from '@nestjs/common';

import { NotAllowedError } from '@core/errors/common/not-allowed.error';
import { Either, left, right } from '@core/logic/either';

import { AttachmentsRepository } from '@domain/marketplace/application/repositories/attachments.repository';
import { CategoriesRepository } from '@domain/marketplace/application/repositories/categories.repository';
import { ProductsRepository } from '@domain/marketplace/application/repositories/products.repository';
import { SellersRepository } from '@domain/marketplace/application/repositories/sellers.repository';
import { ResourceNotFoundError } from '@domain/marketplace/application/use-cases/errors/resource-not-found.error';
import { Product } from '@domain/marketplace/enterprise/entities/product';

interface Params {
  id: string;
  ownerId: string;

  title: string;
  description: string;
  priceInCents: number;
  categoryId: string;
  attachmentsIds: string[];
}

type Result = Either<ResourceNotFoundError | NotAllowedError, { product: Product }>;

@Injectable()
export class EditProductUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private productsRepository: ProductsRepository,
    private categoriesRepository: CategoriesRepository,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute(params: Params): Promise<Result> {
    const [seller, product, category, attachments] = await Promise.all([
      this.sellersRepository.findById(params.ownerId),
      this.productsRepository.findById(params.id),
      this.categoriesRepository.findById(params.categoryId),
      this.attachmentsRepository.findManyByIds(params.attachmentsIds),
    ]);

    if (!seller) {
      return left(new ResourceNotFoundError('Seller', 'ID', params.ownerId));
    }

    if (!product) {
      return left(new ResourceNotFoundError('Product', 'ID', params.id));
    }

    if (!category) {
      return left(new ResourceNotFoundError('Category', 'ID', params.categoryId));
    }

    if (!product.owner.id.equals(seller.id)) {
      return left(new NotAllowedError('You are not the owner of this product.'));
    }

    if (product.status === Product.Status.SOLD) {
      return left(new NotAllowedError('You cannot edit a sold product.'));
    }

    if (!attachments.hasAll) {
      return left(
        new ResourceNotFoundError(
          'Attachment',
          'IDs',
          attachments.inexistentIds.join(', '),
        ),
      );
    }

    product.title = params.title;
    product.description = params.description;
    product.priceInCents = params.priceInCents;
    product.category = category;
    product.attachments.update(attachments.data);

    await this.productsRepository.save(product);

    return right({ product });
  }
}
