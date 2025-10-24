import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [],
  controllers: [PlayerController],
  providers: [PlayerService, AuthService],
})
export class PlayerModule {}
