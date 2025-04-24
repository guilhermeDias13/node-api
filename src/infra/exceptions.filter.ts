import {
  Catch,
  ArgumentsHost,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { NotAllowedError } from '@core/errors/common/not-allowed.error';
import { UseCaseError } from '@core/errors/use-case.error';

import { EmailAlreadyExistsError } from '@domain/marketplace/application/use-cases/errors/email-already-exists.error';
import { InvalidPasswordError } from '@domain/marketplace/application/use-cases/errors/invalid-password.error';
import { PhoneAlreadyExistsError } from '@domain/marketplace/application/use-cases/errors/phone-already-exists.error';
import { ResourceNotFoundError } from '@domain/marketplace/application/use-cases/errors/resource-not-found.error';
import { WrongCredentialsError } from '@domain/marketplace/application/use-cases/errors/wrong-credentials-error';

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') return super.catch(exception, host);
    if (!(exception instanceof UseCaseError)) return super.catch(exception, host);

    switch (exception.constructor) {
      case EmailAlreadyExistsError:
      case PhoneAlreadyExistsError:
        this.catch(new ConflictException(exception.message), host);
      case ResourceNotFoundError:
        this.catch(new NotFoundException(exception.message), host);
      case WrongCredentialsError:
      case NotAllowedError:
        this.catch(new ForbiddenException(exception.message), host);
      case InvalidPasswordError:
        this.catch(new BadRequestException(exception.message), host);
      default:
        return super.catch(
          new InternalServerErrorException(
            `No error handler for this exception: ${exception.message}`,
            { cause: exception },
          ),
          host,
        );
    }
  }
}
