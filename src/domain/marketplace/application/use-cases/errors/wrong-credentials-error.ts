import { UseCaseError } from '@core/errors/use-case.error';

export class WrongCredentialsError extends UseCaseError {
  constructor() {
    super(`Credentials are not valid.`);
  }
}
