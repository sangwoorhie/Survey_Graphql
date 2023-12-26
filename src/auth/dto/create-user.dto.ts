import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Status } from '../common/userinfo';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(Status, {
    message: `학생일 경우 'student', 교사일 경우 'teacher'를 입력해주세요.`,
  })
  status: Status;
}
