import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { TokenOutput } from './auth_guard/token.output';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // 로그인
  @Mutation(() => TokenOutput, { name: 'login' })
  public async login(
    @Args('login', { type: () => LoginUserDto })
    loginDto: LoginUserDto,
  ): Promise<TokenOutput> {
    return new TokenOutput({
      token: this.authService.getTokenForUser(
        await this.authService.validateUser(loginDto.email, loginDto.password),
      ),
    });
  }
}
