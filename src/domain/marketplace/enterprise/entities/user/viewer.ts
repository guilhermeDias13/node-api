import { UniqueEntityID } from '@core/entities/unique-entity-id';

import { User, UserProps } from '@domain/marketplace/enterprise/entities/user/user';

interface ViewerProps extends UserProps {}

export class Viewer extends User {
  static create(props: ViewerProps, id?: UniqueEntityID) {
    const seller = new Viewer(props, id);

    return seller;
  }
}
