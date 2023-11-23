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
  @MinLength(8)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/, {
    message:
      '비밀번호는 최소 4자 이상의 영문 대소문자 및 숫자로 이루어져야 합니다. 생성하신 비밀번호는 해당 설문지 및 문항, 옵션의 수정 및 삭제 시에 사용됩니다.',
  })
  @Transform(({ value }) => bcrypt.hashSync(value, 10))
  readonly password: string;
}
