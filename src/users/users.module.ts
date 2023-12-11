import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersResolver } from './resolvers/users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { LocalStrategy } from '../auth/auth_guard/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/auth_guard/jwt.strategy';
import { AuthResolver } from 'src/auth/auth.resolver';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.AUTH_SECRET,
        signOptions: {
          expiresIn: '60m',
        },
      }),
    }),
  ],
  providers: [
    UsersResolver,
    AuthResolver,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    AuthService,
  ],
})
export class UsersModule {}
