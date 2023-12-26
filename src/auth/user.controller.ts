import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  @Post()
  async create(@Body() createDto: CreateUserDto) {
    const user = new Users();

    if (createDto.password !== createDto.confirmPassword) {
      throw new BadRequestException(
        '비밀번호와 확인 비밀번호는 동일해야 합니다.',
      );
    } else if (createDto.status !== 'student' || 'teacher') {
      throw new BadRequestException(
        `학생일 경우 'student', 교사일 경우 'teacher'를 입력해주세요.`,
      );
    }

    const existingUser = await this.usersRepository.findOne({
      where: { email: createDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('동일한 이메일이 이미 존재합니다.');
    }

    user.email = createDto.email;
    user.password = await this.authService.hashPassword(createDto.password);
    user.name = createDto.name;
    user.status = createDto.status;

    return {
      ...(await this.usersRepository.save(user)),
      token: this.authService.getTokenForUser(user),
    };
  }
}
