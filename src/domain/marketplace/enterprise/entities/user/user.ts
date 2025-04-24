import { Entity } from '@core/entities/entity';

import { Attachment } from '@domain/marketplace/enterprise/entities/attachment';

export interface UserProps {
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar?: Attachment;
}

export abstract class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  set name(name) {
    this.props.name = name;
  }

  get email() {
    return this.props.email;
  }

  set email(email) {
    this.props.email = email;
  }

  get phone() {
    return this.props.phone;
  }

  set phone(phone) {
    this.props.phone = phone;
  }

  get password() {
    return this.props.password;
  }

  set password(password) {
    this.props.password = password;
  }

  get avatar() {
    return this.props.avatar;
  }

  set avatar(avatar) {
    this.props.avatar = avatar;
  }
}
