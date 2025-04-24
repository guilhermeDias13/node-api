import { Controller, HttpCode, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { RegisterViewUseCase } from '@domain/marketplace/application/use-cases/register-view.use-case';

import { EnvService } from '@infra/env/env.service';
import { CurrentUser } from '@infra/http/auth/current-user-decorator';
import { UserPayload } from '@infra/http/auth/jwt.strategy';
import { ProductPresenter } from '@infra/http/presenters/product.presenter';
import { UserPresenter } from '@infra/http/presenters/user.presenter';

class RegisterViewResponse extends createZodDto(
  z.object({ product: ProductPresenter.zod, viewer: UserPresenter.zod }),
) {}

@ApiTags('Viewers')
@ApiParam({ name: 'id', type: 'string', description: 'The product id (uuid)' })
@Controller('/products/:id/views')
export class RegisterViewController {
  constructor(
    private registerView: RegisterViewUseCase,
    private env: EnvService,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({
    description: 'The view was successfully registered.',
    type: RegisterViewResponse,
  })
  @ApiNotFoundResponse({ description: 'The product or viewer was not found.' })
  @ApiForbiddenResponse({ description: 'The viewer is the owner of the product.' })
  @ApiOperation({ summary: 'Register a view on a product' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') productId: string,
  ): Promise<RegisterViewResponse> {
    const result = await this.registerView.execute({ productId, viewerId: user.sub });

    if (result.isLeft()) throw result.value;

    return {
      product: ProductPresenter.toHTTP(this.env, result.value.view.product),
      viewer: UserPresenter.toHTTP(this.env, result.value.view.viewer),
    };
  }
}
