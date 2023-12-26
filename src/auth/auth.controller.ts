import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CurrentUser } from './common/current-user.decorator';
import { Users } from 'src/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 로그인
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@CurrentUser() user: Users) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }
}
