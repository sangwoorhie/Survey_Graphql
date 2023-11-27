import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class UpdateSurveyDto {
  @Field()
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsString({ message: '문자열을 입력해주세요.' })
  @MinLength(5, { message: '최소 5글자 이상이어야 합니다.' })
  @MaxLength(50, { message: '최대 50글자까지 입력 가능합니다.' })
  readonly title: string;

  @Field()
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsString({ message: '문자열을 입력해주세요.' })
  @MinLength(20, { message: '최소 20글자 이상이어야 합니다.' })
  @MaxLength(500, { message: '최대 500글자까지 입력 가능합니다.' })
  readonly description: string;
}
