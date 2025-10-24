import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginData } from './auth.service';

@Controller('battleship')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('create-credentials')
  createCredentials(
    @Body()
    body: {
      username: string;
      password: string;
    },
  ) {
    return this.authService.createCredentials(body.username, body.password);
  }

  @Post('login')
  login(@Body() body: LoginData): Promise<string> {
    return this.authService.login(body);
  }
  @Get('validate-user/:userId')
  validateUser(@Param('userId') userId: string) {
    return this.authService.validUserId(userId);
  }
}
