import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DeleteUserDto } from './dto/delete-user.dto';
import { EntityWithId } from 'src/survey.type';
import { Status } from '../../auth/auth_guard/userinfo';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  // 회원가입 (createUser)
  async createUser(createDto: CreateUserDto): Promise<Users> {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: [{ email: createDto.email }, { name: createDto.name }],
      });
      if (existingUser) {
        throw new BadRequestException(
          '동일한 이메일 또는 이름의 유저가 이미 존재합니다.',
        );
      }
      // if (createDto.status !== Status.PROFESSOR || Status.STUDENT) {
      //   throw new BadRequestException(
      //     '회원 상태는 `professor` 또는 `student`이어야 합니다.',
      //   );
      // }

      // 새로운 유저생성
      const user = new Users({
        ...createDto,
        password: await this.authService.hashPassword(createDto.password),
        // token: this.authService.getTokenForUser(user),
      });

      //저장
      return await this.usersRepository.save(user);
    } catch (error) {
      this.logger.error(`회원가입 중 에러가 발생했습니다: ${error.message}`);
      throw error;
    }
  }

  // 회원정보 수정 (updateUser) => 비밀번호,이름만 수정가능
  async updateUser(
    // userId: number,
    updateDto: UpdateUserDto,
    user: Users,
  ): Promise<Users> {
    try {
      const updateUser = await this.usersRepository.findOne({
        where: { id: user.id },
      });
      const { password, name, status } = updateDto;
      if (!password || !name || !status) {
        throw new BadRequestException('변경 사항을 모두 입력해주세요.');
      }
      if (updateUser.id !== user.id) {
        throw new UnauthorizedException(null, '회원정보 수정 권한이 없습니다.');
      }
      const hashedPassword = await this.authService.hashPassword(
        updateDto.password,
      );

      if (updateDto.status !== Status.PROFESSOR || Status.STUDENT) {
        throw new BadRequestException(
          '회원 상태는 `professor` 또는 `student`이어야 합니다.',
        );
      }
      if (updateDto && updateUser.id === user.id) {
        await this.usersRepository.update(
          { id: updateUser.id },
          { password: hashedPassword, name, status },
        );
      }
      return await this.usersRepository.findOne({ where: { id: user.id } });
    } catch (error) {
      this.logger.error(
        `회원정보 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 회원 탈퇴 (deleteUser)
  async deleteUser(
    // userId: number,
    deleteDto: DeleteUserDto,
    user: Users,
  ): Promise<EntityWithId> {
    try {
      const deleteUser = await this.usersRepository.findOne({
        where: { id: user.id },
      });
      const { password } = deleteDto;
      if (!password) {
        throw new BadRequestException('비밀번호를 입력해 주세요.');
      }
      const ComparedPassword = await bcrypt.compare(password, user.password);

      if (!ComparedPassword) {
        throw new UnauthorizedException(null, 'password가 일치하지 않습니다.');
      }
      if (deleteUser.id !== user.id) {
        throw new UnauthorizedException(null, '회원탈퇴 권한이 없습니다.');
      }
      if (ComparedPassword && deleteUser.id === user.id) {
        await this.usersRepository.remove(deleteUser);
        return new EntityWithId(user.id);
      }
    } catch (error) {
      this.logger.error(`회원 탈퇴 중 에러가 발생했습니다: ${error.message}`);
      throw error;
    }
  }

  // 단일 회원조회 (getSingleUser)
  async getSingleUser(userId: number): Promise<Users> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('해당 회원이 존재하지 않습니다.');
      }
      return user;
    } catch (error) {
      this.logger.error(`회원조회 중 에러가 발생했습니다: ${error.message}`);
      throw error;
    }
  }
}
