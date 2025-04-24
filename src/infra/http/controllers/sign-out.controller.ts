import { Controller, Post, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Sessions')
@Controller('sign-out')
export class SignOutController {
  @Post()
  @ApiOkResponse({ description: 'The user was successfully signed out.' })
  @ApiOperation({ summary: 'Sign out' })
  async handle(@Res() response: Response) {
    response.clearCookie('auth');

    return response.status(204).end();
  }
}
