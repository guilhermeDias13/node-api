import { AsyncMaybe } from '@core/logic/maybe';

import { Viewer } from '@domain/marketplace/enterprise/entities/user/viewer';

export abstract class ViewersRepository {
  abstract findById(id: string): AsyncMaybe<Viewer>;
}
