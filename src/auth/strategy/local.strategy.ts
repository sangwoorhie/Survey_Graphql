import { AuthService } from 'src/auth/auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly AuthService: AuthService) {
    super();
  }
  public async validate(email: string, password: string): Promise<any> {
    return await this.AuthService.validateUser(email, password);
  }
}
