import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [],
  controllers: [ImagesController],
  providers: [ImagesService, AuthService],
})
export class ImagesModule {}
