import { Body, Controller, Get, Param, Post, Req, Put } from '@nestjs/common';
import { PlayerService } from './player.service';
import { AuthService } from '../auth/auth.service';
import type { Request, Response } from 'express';
import { Boats } from 'src/boats/boats.service';

@Controller('battleship')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
    private readonly authService: AuthService,
  ) {}

  @Put('update/name')
  async updatePlayerName(@Body('name') name: string, @Req() req: Request) {
    const headerValue = req.get?.('userId') ?? req.headers['userId'];

    const userId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Missing or invalid userId header');
    }
    return await this.playerService.updatePlayerName(userId, name);
  }

  @Post('initPlayer')
  async initPlayer() {
    return this.playerService.initPlayer();
  }

  @Get('ownPlayer')
  async getOwnPlayer(@Req() req: Request) {
    const headerValue = req.get?.('userId') ?? req.headers['userId'];

    const userId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Missing or invalid userId header');
    }
    if (await this.authService.validUserId(userId)) {
      return this.playerService.getOwnPlayer(userId);
    } else {
      throw new Error('Invalid userId');
    }
  }

  @Get('enemies')
  async getAllPlayers(@Req() req: Request) {
    const headerValue = req.get?.('userId') ?? req.headers['userId'];

    const userId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Missing or invalid userId header');
    }
    if (await this.authService.validUserId(userId)) {
      return this.playerService.getAllPlayers(userId);
    } else {
      throw new Error('Invalid userId');
    }
  }
}
