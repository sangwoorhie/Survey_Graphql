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
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  @MaxLength(500)
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,20}/)
  @Transform(({ value }) => {
    if (!value.match(/^[A-Za-z\d!]d!@#$%^&*()]{8,20}$/)) {
      throw new Error(
        '비밀번호는 최소 8자에서, 최대 20자이어야 하며, 영문 대소문자, 숫자, 특수문자를 포함해야 합니다. 생성하신 비밀번호는 해당 설문지 및 문항, 옵션의 수정 및 삭제 시에 사용됩니다.',
      );
    }
    return bcrypt.hashSync(value, 10);
  })
  readonly password: string;
}
