import { AuthService } from 'src/auth/auth.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TokenOutput } from './dto/token.output';
import { LoginDto } from './dto/login.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // 로그인
  @Mutation(() => TokenOutput, { name: 'login' })
  public async login(
    @Args('input', { type: () => LoginDto }) input: LoginDto,
  ): Promise<TokenOutput> {
    return new TokenOutput({
      token: this.authService.getTokenForUser(
        await this.authService.validateUser(input.email, input.password),
      ),
    });
  }
}
