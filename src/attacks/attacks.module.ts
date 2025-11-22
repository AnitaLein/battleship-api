import { Module } from '@nestjs/common';
import { AttacksService } from './attacks.service';
import { AttacksController } from './attacks.controller';
import { AuthService } from 'src/auth/auth.service';
import { PlayerService } from 'src/player/player.service';

@Module({
  imports: [],
  controllers: [AttacksController],
  providers: [AttacksService, AuthService, PlayerService],
})
export class AttacksModule {}
