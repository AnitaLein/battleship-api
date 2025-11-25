import {
  Controller,
  Post,
  Body,
  Param,
  BadRequestException,
  Req,
  Get,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import type { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Controller('battleship')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly authService: AuthService,
  ) {}

  @Post('upload-profile')
  async uploadProfilePicture(
    @Body('image') base64Image: string,
    @Req() req: Request,
  ) {
    if (!base64Image) {
      throw new BadRequestException('No image provided');
    }
    const headerValue = req.get?.('userId') ?? req.headers['userId'];

    const userId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Missing or invalid userId header');
    }
    if (await this.authService.validUserId(userId)) {
      try {
        const url = await this.imagesService.uploadProfilePicture(
          userId,
          base64Image,
        );

        return {
          message: 'Profile picture uploaded successfully',
          url,
        };
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }
  }
  @Get('ownProfilePicture')
  async loadOwnPicture(@Req() req: Request) {
    const headerValue = req.get?.('userId') ?? req.headers['userId'];

    const userId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Missing or invalid userId header');
    }
    if (await this.authService.validUserId(userId)) {
      const url = await this.imagesService.getProfilePictureUrl(userId);
      return { url };
    }
  }

  @Post('enemyProfilePicture')
  async getEnemyProfilePicture(
    @Req() req: Request,
    @Body('enemyTeamName') enemyTeamName: string,
  ) {
    const headerValue = req.get?.('userId') ?? req.headers['userId'];

    const userId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Missing or invalid userId header');
    }
    if (await this.authService.validUserId(userId)) {
      const url =
        await this.imagesService.getEnemyProfilePictureUrl(enemyTeamName);
      return { url };
    }
  }

  @Post('attackPicture/')
  async uploadAttackPicture(
    @Body('attackId') attackId: string,
    @Body('image') base64Image: string,
    @Req() req: Request,
  ) {
    if (!base64Image) {
      throw new BadRequestException('No image provided');
    }
    const headerValue = req.get?.('userId') ?? req.headers['userId'];
    const userId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Missing or invalid userId header');
    }
    if (await this.authService.validUserId(userId)) {
      try {
        const url = await this.imagesService.uploadAttackPicture(
          attackId,
          base64Image,
        );

        return {
          message: 'Attack picture uploaded successfully',
          url,
        };
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Get('attackPicture/:attackId')
  async getAttackPicture(
    @Param('attackId') attackId: string,
    @Req() req: Request,
  ) {
    const headerValue = req.get?.('userId') ?? req.headers['userId'];
    const userId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Missing or invalid userId header');
    }
    if (await this.authService.validUserId(userId)) {
      try {
        const url = await this.imagesService.getAttackPictureUrl(attackId);
        return {
          message: 'Attack picture retrieved successfully',
          url,
        };
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }
  }
}
