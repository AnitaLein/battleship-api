import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';
import { BoatsModule } from './boats/boats.module';
import { AttacksModule } from './attacks/attacks.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [AuthModule, PlayerModule, BoatsModule, AttacksModule, ImagesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
