import { UseCaseError } from '@core/errors/use-case.error';

export class InvalidPasswordError extends UseCaseError {
  constructor(message?: string) {
    super(message ?? 'The password is invalid');
  }
}
