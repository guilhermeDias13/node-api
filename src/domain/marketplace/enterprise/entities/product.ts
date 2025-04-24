import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Optional } from '@core/types/optional';
import { Replace } from '@core/types/replace';

import { Attachment } from '@domain/marketplace/enterprise/entities/attachment';
import { Category } from '@domain/marketplace/enterprise/entities/category';
import { ProductAttachments } from '@domain/marketplace/enterprise/entities/product-attachments';
import { Seller } from '@domain/marketplace/enterprise/entities/user/seller';

export enum ProductStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  CANCELLED = 'cancelled',
}

interface ProductProps {
  title: string;
  description: string;
  priceInCents: number;
  status: ProductStatus;
  owner: Seller;
  category: Category;
  attachments: ProductAttachments;
  createdAt: Date;
}

export class Product extends Entity<ProductProps> {
  static Status = ProductStatus;

  get title() {
    return this.props.title;
  }

  set title(value) {
    this.props.title = value;
  }

  get description() {
    return this.props.description;
  }

  set description(value) {
    this.props.description = value;
  }

  get priceInCents() {
    return this.props.priceInCents;
  }

  set priceInCents(value) {
    this.props.priceInCents = value;
  }

  get status() {
    return this.props.status;
  }

  set status(value) {
    this.props.status = value;
  }

  get owner() {
    return this.props.owner;
  }

  get category() {
    return this.props.category;
  }

  set category(value) {
    this.props.category = value;
  }

  get attachments() {
    return this.props.attachments;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Replace<
      Optional<ProductProps, 'createdAt' | 'status'>,
      { attachments?: Attachment[] }
    >,
    id?: UniqueEntityID,
  ) {
    return new Product(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? ProductStatus.AVAILABLE,
        attachments: ProductAttachments.create(props.attachments),
      },
      id,
    );
  }
}
