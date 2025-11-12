import { Module } from '@nestjs/common';
import { AttacksService } from './attacks.service';
import { AttacksController } from './attacks.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [],
  controllers: [AttacksController],
  providers: [AttacksService, AuthService],
})
export class AttacksModule {}
