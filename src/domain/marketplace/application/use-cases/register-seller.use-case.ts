import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@core/logic/either';

import { HashGenerator } from '@domain/marketplace/application/cryptography/hash-generator';
import { AttachmentsRepository } from '@domain/marketplace/application/repositories/attachments.repository';
import { SellersRepository } from '@domain/marketplace/application/repositories/sellers.repository';
import { EmailAlreadyExistsError } from '@domain/marketplace/application/use-cases/errors/email-already-exists.error';
import { PhoneAlreadyExistsError } from '@domain/marketplace/application/use-cases/errors/phone-already-exists.error';
import { ResourceNotFoundError } from '@domain/marketplace/application/use-cases/errors/resource-not-found.error';
import { Seller } from '@domain/marketplace/enterprise/entities/user/seller';

interface Params {
  name: string;
  phone: string;
  email: string;
  password: string;
  avatarId?: string;
}

type Result = Either<
  EmailAlreadyExistsError | PhoneAlreadyExistsError | ResourceNotFoundError,
  { seller: Seller }
>;

@Injectable()
export class RegisterSellerUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private attachmentsRepository: AttachmentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(params: Params): Promise<Result> {
    const email = params.email.toLowerCase();

    const [sellerByEmail, sellerByPhone] = await Promise.all([
      this.sellersRepository.findByEmail(email),
      this.sellersRepository.findByPhone(params.phone),
    ]);

    if (sellerByEmail) {
      return left(new EmailAlreadyExistsError(email));
    }

    if (sellerByPhone) {
      return left(new PhoneAlreadyExistsError(params.phone));
    }

    const hashedPassword = await this.hashGenerator.hash(params.password);

    const seller = Seller.create({
      email,
      name: params.name,
      phone: params.phone,
      password: hashedPassword,
    });

    if (params.avatarId) {
      const attachment = await this.attachmentsRepository.findById(params.avatarId);

      if (!attachment) {
        return left(new ResourceNotFoundError('Attachment', 'ID', params.avatarId));
      }

      seller.avatar = attachment;
    }

    await this.sellersRepository.create(seller);

    return right({ seller });
  }
}
