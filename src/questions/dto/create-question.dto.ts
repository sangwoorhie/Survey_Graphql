import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty({ message: '질문을 작성해주세요.' })
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  readonly content: string;
}
