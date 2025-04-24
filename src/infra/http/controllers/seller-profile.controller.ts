import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { SellerProfileUseCase } from '@domain/marketplace/application/use-cases/seller-profile.use-case';

import { EnvService } from '@infra/env/env.service';
import { CurrentUser } from '@infra/http/auth/current-user-decorator';
import { UserPayload } from '@infra/http/auth/jwt.strategy';
import { UserPresenter } from '@infra/http/presenters/user.presenter';

class SellerProfileResponse extends createZodDto(
  z.object({ seller: UserPresenter.zod }),
) {}

@ApiTags('Sellers')
@Controller('/sellers/me')
export class SellerProfileController {
  constructor(
    private sellerProfile: SellerProfileUseCase,
    private env: EnvService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'The seller profile was successfully found.',
    type: SellerProfileResponse,
  })
  @ApiOperation({ summary: 'Get the seller profile' })
  async handle(@CurrentUser() user: UserPayload): Promise<SellerProfileResponse> {
    const result = await this.sellerProfile.execute({ id: user.sub });

    if (result.isLeft()) throw result.value;

    return { seller: UserPresenter.toHTTP(this.env, result.value.seller) };
  }
}
