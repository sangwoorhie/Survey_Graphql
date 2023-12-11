import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  // JWT Service
  getTokenForUser(user: Users): string {
    return this.jwtService.sign({
      // name: user.name,
      email: user.email,
      sub: user.id,
    });
  }

  // HashPassword Service
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  // validate User
  async validateUser(email: string, password: string): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      this.logger.debug(`회원 E-mail: ${email}이 조회되지 않습니다.`);
      throw new UnauthorizedException();
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`${user.name} 회원의 비밀번호와 일치하지 않습니다.`);
      throw new UnauthorizedException();
    }
    return user;
  }
}
