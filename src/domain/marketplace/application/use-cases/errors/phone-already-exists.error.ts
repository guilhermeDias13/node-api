import { UseCaseError } from '@core/errors/use-case.error';

export class PhoneAlreadyExistsError extends UseCaseError {
  constructor(phone: string) {
    super(`The phone '${phone}' is already in use.`);
  }
}
