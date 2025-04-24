import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Optional } from '@core/types/optional';

import { Product } from '@domain/marketplace/enterprise/entities/product';
import { Viewer } from '@domain/marketplace/enterprise/entities/user/viewer';

interface Props {
  viewer: Viewer;
  product: Product;
  createdAt: Date;
}

export class View extends Entity<Props> {
  get viewer() {
    return this.props.viewer;
  }

  get product() {
    return this.props.product;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Optional<Props, 'createdAt'>, id?: UniqueEntityID) {
    return new View(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
