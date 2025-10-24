import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlayerService } from './player.service';
import { AuthService } from '../auth/auth.service';

@Controller('battleship')
export class PlayerController {
  constructor(private readonly playerService: PlayerService,
    private readonly authService: AuthService,
  ) {}

  @Post('create-player')
  async createPlayer(
    @Body()
    body: {
      userId: string;
      name: string;
    },
  ) {
    if (await this.authService.validUserId(body.userId)) {
      return this.playerService.createPlayer(body.userId, body.name);
    } else {
      throw new Error('Invalid userId');
    }
  }

  @Get('get-all-players/:userId')
  async getAllPlayers(@Param('userId') userId: string) {
    if (await this.authService.validUserId(userId)) {
      return this.playerService.getAllPlayers(userId);
    } else {
      throw new Error('Invalid userId');
    }
  }
}
