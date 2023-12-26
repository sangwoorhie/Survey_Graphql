import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { Users } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly JwtService: JwtService) {}

  // 토큰발급
  public getTokenForUser(user: Users): string {
    return this.JwtService.sign({
      email: user.email,
      sub: user.id,
    });
  }

  // 해시패스워드
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
