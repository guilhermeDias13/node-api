import { WatchedList } from '@core/entities/watched-list';

import { Attachment } from '@domain/marketplace/enterprise/entities/attachment';

export class ProductAttachments extends WatchedList<Attachment> {
  compareItems(a: Attachment, b: Attachment): boolean {
    return a.equals(b);
  }

  static create(attachments?: Attachment[]) {
    return new ProductAttachments(attachments);
  }
}
