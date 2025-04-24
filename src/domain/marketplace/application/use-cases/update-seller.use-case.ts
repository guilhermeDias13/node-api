import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@core/logic/either';

import { HashComparer } from '@domain/marketplace/application/cryptography/hash-comparer';
import { HashGenerator } from '@domain/marketplace/application/cryptography/hash-generator';
import { AttachmentsRepository } from '@domain/marketplace/application/repositories/attachments.repository';
import { SellersRepository } from '@domain/marketplace/application/repositories/sellers.repository';
import { EmailAlreadyExistsError } from '@domain/marketplace/application/use-cases/errors/email-already-exists.error';
import { InvalidPasswordError } from '@domain/marketplace/application/use-cases/errors/invalid-password.error';
import { PhoneAlreadyExistsError } from '@domain/marketplace/application/use-cases/errors/phone-already-exists.error';
import { ResourceNotFoundError } from '@domain/marketplace/application/use-cases/errors/resource-not-found.error';
import { WrongCredentialsError } from '@domain/marketplace/application/use-cases/errors/wrong-credentials-error';
import { Seller } from '@domain/marketplace/enterprise/entities/user/seller';

interface Params {
  userId: string;

  name: string;
  phone: string;
  email: string;
  avatarId?: string;
  password?: string;
  newPassword?: string;
}

type Result = Either<
  | EmailAlreadyExistsError
  | PhoneAlreadyExistsError
  | ResourceNotFoundError
  | WrongCredentialsError
  | InvalidPasswordError,
  { seller: Seller }
>;

@Injectable()
export class UpdateSellerUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private attachmentsRepository: AttachmentsRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(params: Params): Promise<Result> {
    const email = params.email.toLowerCase();

    const [seller, sellerByEmail, sellerByPhone, avatar] = await Promise.all([
      this.sellersRepository.findById(params.userId),
      this.sellersRepository.findByEmail(email),
      this.sellersRepository.findByPhone(params.phone),
      params.avatarId
        ? this.attachmentsRepository.findById(params.avatarId)
        : Promise.resolve(undefined),
    ]);

    if (!seller) {
      return left(new ResourceNotFoundError('Seller', 'ID', params.userId));
    }

    if (params.avatarId && !avatar) {
      return left(new ResourceNotFoundError('Attachment', 'ID', params.avatarId));
    }

    if (sellerByEmail && !seller.equals(sellerByEmail)) {
      return left(new EmailAlreadyExistsError(email));
    }

    if (sellerByPhone && !seller.equals(sellerByPhone)) {
      return left(new PhoneAlreadyExistsError(params.phone));
    }

    seller.email = email;
    seller.name = params.name;
    seller.phone = params.phone;
    if (avatar) seller.avatar = avatar;

    if (params.newPassword && params.password) {
      const currentPasswordMatch = await this.hashComparer.compare(
        params.password,
        seller.password,
      );

      if (!currentPasswordMatch) return left(new WrongCredentialsError());

      const newPasswordMatch = await this.hashComparer.compare(
        params.newPassword,
        seller.password,
      );

      if (newPasswordMatch) {
        return left(
          new InvalidPasswordError(
            'The new password must be different from the current one.',
          ),
        );
      }

      seller.password = await this.hashGenerator.hash(params.newPassword);
    }

    await this.sellersRepository.save(seller);

    return right({ seller });
  }
}
