import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsNumber,
} from 'class-validator';

@InputType()
export class CreateQuestionDto {
  @Field()
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsNumber()
  readonly questionNumber: number;

  @Field()
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsString({ message: '문자열을 입력해주세요.' })
  @MinLength(10, { message: '최소 10글자 이상이어야 합니다.' })
  @MaxLength(50, { message: '최대 50글자까지 입력 가능합니다.' })
  readonly content: string;
}
