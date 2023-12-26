import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-jwt';
import { Users } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {
    super();
  }
  public async validate(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      this.logger.debug(`사용자 E-mail ${email}가 조회되지 않습니다`);
      throw new UnauthorizedException();
    }
    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`올바른 비밀번호가 아닙니다.`);
      throw new UnauthorizedException();
    }
    return user;
  }
}
