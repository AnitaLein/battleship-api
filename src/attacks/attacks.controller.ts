import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AttacksService } from './attacks.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('battleship')
export class AttacksController {
  constructor(
    private readonly attacksService: AttacksService,
    private readonly authService: AuthService,
  ) {}

  @Post('attacks')
  async attack(
    @Body() body: { targetName: string; targetField: string },
    @Req() req: Request,
  ) {
    const headerValue = req.get?.('userId') ?? req.headers['userId'];

    const userId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    console.log(userId);
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Missing or invalid userId header');
    }
    if (await this.authService.validUserId(userId)) {
      return await this.attacksService.attack(
        userId,
        body.targetName,
        body.targetField,
      );
    }
  }

  @Get('attacks')
  async getAllAttacks(@Req() req: Request) {
    const headerValue = req.get?.('userId') ?? req.headers['userId'];

    const userId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    console.log('test');
    console.log(userId);
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Missing or invalid userId header');
    }
    if (await this.authService.validUserId(userId)) {
      console.log('valid userId');
      return await this.attacksService.getAllAttacks();
    }
  }
}
