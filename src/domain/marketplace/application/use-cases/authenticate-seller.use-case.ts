import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@core/logic/either';

import { Encrypter } from '@domain/marketplace/application/cryptography/encrypter';
import { HashComparer } from '@domain/marketplace/application/cryptography/hash-comparer';
import { SellersRepository } from '@domain/marketplace/application/repositories/sellers.repository';
import { WrongCredentialsError } from '@domain/marketplace/application/use-cases/errors/wrong-credentials-error';

interface Params {
  email: string;
  password: string;
}

type Result = Either<WrongCredentialsError, { accessToken: string }>;

@Injectable()
export class AuthenticateSellerUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute(params: Params): Promise<Result> {
    const seller = await this.sellersRepository.findByEmail(params.email);

    if (!seller) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      params.password,
      seller.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: seller.id.toString(),
    });

    return right({ accessToken });
  }
}
