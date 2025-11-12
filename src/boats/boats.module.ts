import { Module } from '@nestjs/common';

import { BoatsController } from './boats.controller';
import { BoatsService } from './boats.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [],
  controllers: [BoatsController],
  providers: [BoatsService, AuthService],
})
export class BoatsModule {}
