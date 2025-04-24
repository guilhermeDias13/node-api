import { ApiBody } from '@nestjs/swagger';

export const ApiMultiFile =
  (fileName: string = 'files'): MethodDecorator =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      type: 'multipart/form-data',
      required: true,
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
