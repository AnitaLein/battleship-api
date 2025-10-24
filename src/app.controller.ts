import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('battleship')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('players')
  getPlayers() {
    return this.appService.getPlayers();
  }

  @Get('player/:id')
  getPlayer(@Param('id') id: string) {
    return this.appService.getPlayer(id);
  }

  @Get('attacks')
  getAttacks() {
    return this.appService.getAttacks();
  }

  @Post('attack')
  postAttack(
    @Body()
    body: {
      AttackerId: number;
      DefenderId: number;
      Position: string;
      IsHit: boolean;
    },
  ) {
    return this.appService.addAttack(body);
  }
}
