import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { Users } from '../entities/user.entity';
import { Surveys } from 'src/surveys/entities/surveys.entity';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';
import { EntityWithId } from 'src/survey.type';
import { AuthGuardJwtGql } from '../../auth/auth_guard/auth-guard-jwt.gql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../auth/auth_guard/current-user.decorator';
import { AuthService } from 'src/auth/auth.service';

@Resolver(() => Users)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // 회원가입 (createUser)
  @Mutation(() => Users, { name: 'createUser' })
  public async createUser(
    @Args('createDto', { type: () => CreateUserDto })
    createDto: CreateUserDto,
  ) {
    const user = await this.usersService.createUser(createDto);

    return {
      ...user,
      token: this.authService.getTokenForUser(user),
    };
  }

  // 회원정보 수정 (updateUser) => 비밀번호,이름만 수정가능
  @Mutation(() => Users, { name: 'updateUser' })
  public async updateUser(
    // @Args('userId', { type: () => Int }) userId: number,
    @Args('updateDto', { type: () => UpdateUserDto })
    updateDto: UpdateUserDto,
    @CurrentUser() user: Users,
  ) {
    return await this.usersService.updateUser(updateDto, user);
  }

  // 회원 탈퇴 (deleteUser)
  @Mutation(() => EntityWithId, { name: 'deleteUser' })
  public async deleteUser(
    // @Args('userId', { type: () => Int }) userId: number,
    @Args('deleteDto', { type: () => DeleteUserDto })
    deleteDto: DeleteUserDto,
    @CurrentUser() user: Users,
  ) {
    return await this.usersService.deleteUser(deleteDto, user);
  }

  // 단일 회원조회 (getSingleUser)
  @Query(() => Users, { name: 'getSingleUser' })
  @UseGuards(AuthGuardJwtGql)
  public async getSingleUser(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return await this.usersService.getSingleUser(userId);
  }

  // // 로그인 (loginUser)
  // @Mutation(() => Users, { name: 'loginUser' })
  // @UseGuards(AuthGuardLocal)
  // public async loginUser(@CurrentUser() user: Users) {
  //   return {
  //     userId: user.id,
  //     token: this.authService.getTokenForUser(user),
  //   };
  // }

  // Users - Surveys = N : N
  @ResolveField('surveys')
  public async surveys(@Parent() users: Users): Promise<Surveys[]> {
    return await users.surveys;
  }
}
