import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

interface AttachmentProps {
  path: string;
}

export class Attachment extends Entity<AttachmentProps> {
  get path(): string {
    return this.props.path;
  }

  static create(props: AttachmentProps, id?: UniqueEntityID) {
    return new Attachment(props, id);
  }
}
