import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

interface CategoryProps {
  title: string;
  slug: string;
}

export class Category extends Entity<CategoryProps> {
  get title() {
    return this.props.title;
  }

  get slug() {
    return this.props.slug;
  }

  static create(props: CategoryProps, id?: UniqueEntityID) {
    return new Category(props, id);
  }
}
