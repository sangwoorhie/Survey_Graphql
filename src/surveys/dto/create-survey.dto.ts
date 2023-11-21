import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as bcrypt from 'bcrypt';

export class CreateSurveyDto {
  @IsNotEmpty({ message: '제목을 작성해주세요.' })
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  readonly title: string;

  @IsNotEmpty({ message: '설문 내용을 작성해주세요' })
  @IsString()
  @MinLength(20)
  @MaxLength(500)
  readonly description: string;

  @IsNotEmpty({ message: '비밀번호를 생성해주세요' })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}/)
  @Transform(({ value }) => bcrypt.hashSync(value, 10))
  readonly password: string;
}
