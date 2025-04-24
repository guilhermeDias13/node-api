import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@core/logic/either';

import { SellersRepository } from '@domain/marketplace/application/repositories/sellers.repository';
import { ResourceNotFoundError } from '@domain/marketplace/application/use-cases/errors/resource-not-found.error';
import { Seller } from '@domain/marketplace/enterprise/entities/user/seller';

interface Params {
  id: string;
}

type Result = Either<ResourceNotFoundError, { seller: Seller }>;

@Injectable()
export class SellerProfileUseCase {
  constructor(private sellersRepository: SellersRepository) {}

  async execute(params: Params): Promise<Result> {
    const seller = await this.sellersRepository.findById(params.id);

    if (!seller) {
      return left(new ResourceNotFoundError('Seller', 'ID', params.id));
    }

    return right({ seller });
  }
}
