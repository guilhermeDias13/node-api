import { UseCaseError } from '@core/errors/use-case.error';

export class EmailAlreadyExistsError extends UseCaseError {
  constructor(email: string) {
    super(`The email '${email}' is already in use.`);
  }
}
