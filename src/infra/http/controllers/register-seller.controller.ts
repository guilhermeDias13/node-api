import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { RegisterSellerUseCase } from '@domain/marketplace/application/use-cases/register-seller.use-case';

import { EnvService } from '@infra/env/env.service';
import { Public } from '@infra/http/auth/public';
import { UserPresenter } from '@infra/http/presenters/user.presenter';

const bodySchema = z
  .object({
    name: z.string(),
    phone: z.string().describe('Unique'),
    email: z.string().email().describe('Unique'),
    avatarId: z
      .string()
      .optional()
      .nullable()
      .transform((v) => v || undefined)
      .describe('Created in POST - /attachments'),
    password: z.string(),
    passwordConfirmation: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ['password', 'passwordConfirmation'],
      });
    }
  });

class CreateSellerBody extends createZodDto(bodySchema) {}

class CreateSellerResponse extends createZodDto(
  z.object({ seller: UserPresenter.zod }),
) {}

@Public()
@ApiTags('Sellers')
@Controller('/sellers')
export class RegisterSellerController {
  constructor(
    private registerSeller: RegisterSellerUseCase,
    private envService: EnvService,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new seller' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateSellerResponse,
  })
  @ApiConflictResponse({ description: 'The email or phone already exists.' })
  @ApiNotFoundResponse({ description: 'The avatar was not found.' })
  async handle(@Body() body: CreateSellerBody): Promise<CreateSellerResponse> {
    const result = await this.registerSeller.execute({
      name: body.name,
      phone: body.phone,
      email: body.email,
      password: body.password,
      avatarId: body.avatarId,
    });

    if (result.isLeft()) throw result.value;

    return {
      seller: UserPresenter.toHTTP(this.envService, result.value.seller),
    };
  }
}
