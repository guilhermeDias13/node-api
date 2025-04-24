import { Body, Controller, HttpCode, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { UpdateSellerUseCase } from '@domain/marketplace/application/use-cases/update-seller.use-case';

import { EnvService } from '@infra/env/env.service';
import { CurrentUser } from '@infra/http/auth/current-user-decorator';
import { UserPayload } from '@infra/http/auth/jwt.strategy';
import { UserPresenter } from '@infra/http/presenters/user.presenter';

class UpdateSellerBody extends createZodDto(
  z
    .object({
      name: z.string(),
      phone: z.string(),
      email: z.string().email(),
      avatarId: z.string().uuid().optional(),
      password: z
        .string()
        .min(1)
        .optional()
        .describe('The `password` is required when `newPassword` is present'),
      newPassword: z.string().min(1).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.newPassword && data.password === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_type,
          expected: 'string',
          received: 'undefined',
          message: 'The password is required when newPassword is present',
          path: ['password'],
        });
      }
    }),
) {}

class UpdateSellerResponse extends createZodDto(
  z.object({ seller: UserPresenter.zod }),
) {}

@ApiTags('Sellers')
@Controller('sellers')
export class UpdateSellerController {
  constructor(
    private updateSeller: UpdateSellerUseCase,
    private envService: EnvService,
  ) {}

  @Put()
  @HttpCode(201)
  @ApiOperation({ summary: 'Update the current seller' })
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: UpdateSellerResponse,
  })
  @ApiConflictResponse({ description: 'The email or phone already exists.' })
  @ApiNotFoundResponse({ description: 'The seller or avatar was not found.' })
  @ApiForbiddenResponse({ description: 'Invalid credentials.' })
  @ApiBadRequestResponse({ description: 'The newPassword must be different' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: UpdateSellerBody,
  ): Promise<UpdateSellerResponse> {
    const result = await this.updateSeller.execute({
      userId: user.sub,
      name: body.name,
      phone: body.phone,
      email: body.email,
      avatarId: body.avatarId,
      password: body.password,
      newPassword: body.newPassword,
    });

    if (result.isLeft()) throw result.value;

    return {
      seller: UserPresenter.toHTTP(this.envService, result.value.seller),
    };
  }
}
