import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateQuestionDto {
  @IsNotEmpty({ message: '질문을 작성해주세요.' })
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  readonly newContent: string; // 제목

  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString()
  readonly password: string;
}
