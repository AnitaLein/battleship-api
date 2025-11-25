import { Body, Controller, Get, Param, Post, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginData } from './auth.service';
import type { Request, Response } from 'express';
import path from 'path';

@Controller('battleship')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-credentials')
  createCredentials(
    @Body()
    body: {
      username: string;
      password: string;
    },
  ) {
    return this.authService.createCredentials(body.username, body.password);
  }

  @Post('login')
  async login(
    @Body() body: LoginData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const response = await this.authService.login(body);
    res.cookie('id', response.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return response;
  }
  @Get('validate-user/:userId')
  validateUser(@Param('userId') userId: string) {
    return this.authService.validUserId(userId);
  }

  @Get('team-created')
  checkTeamCreated(@Req() req: Request) {
    const headerValue = req.get?.('userId') ?? req.headers['userId'];

    const userId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Missing or invalid userId header');
    }
    return this.authService.checkTeamCreated(userId);
  }
}
