import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Status } from '../../auth/auth_guard/userinfo';

@InputType()
export class CreateUserDto {
  @Field()
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsString()
  @IsEmail()
  @MaxLength(30)
  readonly email: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}/)
  @Transform(({ value }) => bcrypt.hashSync(value, 10))
  readonly password: string;

  @Field()
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsString({ message: '문자열을 입력해주세요.' })
  @MinLength(2, { message: '최소 2글자 이상이어야 합니다.' })
  @MaxLength(30, { message: '최대 30글자까지 입력 가능합니다.' })
  readonly name: string;

  @Field(() => Status) // Status Enum으로 타입 정의
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsEnum(Status) // Enum 값인지 검증
  readonly status: Status;
}
