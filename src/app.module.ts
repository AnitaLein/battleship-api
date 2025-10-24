import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [AuthModule, PlayerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
