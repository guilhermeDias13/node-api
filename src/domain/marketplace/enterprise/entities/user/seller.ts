import { UniqueEntityID } from '@core/entities/unique-entity-id';

import { User, UserProps } from '@domain/marketplace/enterprise/entities/user/user';

interface SellerProps extends UserProps {}

export class Seller extends User {
  static create(props: SellerProps, id?: UniqueEntityID) {
    const seller = new Seller(props, id);

    return seller;
  }
}
