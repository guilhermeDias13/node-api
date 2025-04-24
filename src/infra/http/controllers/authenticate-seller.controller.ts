import { Body, Controller, Post, Res } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { AuthenticateSellerUseCase } from '@domain/marketplace/application/use-cases/authenticate-seller.use-case';

import { Public } from '@infra/http/auth/public';

class AuthenticateSellerBody extends createZodDto(
  z.object({
    email: z.string().email(),
    password: z.string(),
  }),
) {}

class AuthenticateSellerResponse extends createZodDto(
  z.object({ accessToken: z.string() }),
) {}

@Public()
@ApiTags('Sessions')
@Controller('/sellers/sessions')
export class AuthenticateSellerController {
  constructor(private authenticateSeller: AuthenticateSellerUseCase) {}

  @Post()
  @ApiOkResponse({
    description: 'The seller access token',
    type: AuthenticateSellerResponse,
  })
  @ApiForbiddenResponse({ description: 'Invalid credentials.' })
  @ApiOperation({ summary: 'Get the seller access token' })
  async handle(@Body() body: AuthenticateSellerBody, @Res() response: Response) {
    const { email, password } = body;

    const result = await this.authenticateSeller.execute({
      email,
      password,
    });

    if (result.isLeft()) throw result.value;

    const { accessToken } = result.value;

    response.cookie('auth', accessToken, { httpOnly: true, path: '/' });

    return response.json({ accessToken });
  }
}
