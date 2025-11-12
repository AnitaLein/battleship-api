import {
  Body,
  Controller,
  Post,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { BoatsService } from './boats.service';
import { AuthService } from '../auth/auth.service';
import type { Request, Response } from 'express';

@Controller('battleship')
export class BoatsController {
  constructor(
    private readonly boatService: BoatsService,
    private readonly authService: AuthService,
  ) {}

  @Post('createBoat')
  async addBoats(
    @Body()
    body: {
      boats: {
        size: number;
        positions: string[];
        hitPositions: string[];
      }[];
    },
    @Req() req: Request,
  ) {
    const headerValue = req.get?.('userId') ?? req.headers['userId'];

    const userId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    console.log(userId);
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Missing or invalid userId header');
    }
    if (!body.boats || !Array.isArray(body.boats)) {
      throw new BadRequestException('Invalid boats data');
    }

    return this.boatService.addBoats(userId, body.boats);
  }
}
