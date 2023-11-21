import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateOptionDto {
  @IsNotEmpty({ message: '선택지 내용을 작성해주세요.' })
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  readonly newContent?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  readonly newScore?: number;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString()
  readonly password: string;
}
