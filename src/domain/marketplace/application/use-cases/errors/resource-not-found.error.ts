import { UseCaseError } from '@core/errors/use-case.error';

export class ResourceNotFoundError extends UseCaseError {
  constructor(resource: string, identifier: string, value: string) {
    super(`${resource} with ${identifier} '${value}' was not found.`);
  }
}
