import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Users } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly JwtService: JwtService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

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

  // 유저 신분확인
  public async validateUser(email: string, password: string): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException(
        `사용자 E-mail ${email}가 조회되지 않습니다`,
      );
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(`올바른 비밀번호가 아닙니다.`);
    }
    return user;
  }
}
