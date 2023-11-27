import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class UpdateOptionDto {
  @Field()
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsString({ message: '문자열을 입력해주세요.' })
  @MaxLength(20, { message: '최대 20글자까지 입력 가능합니다.' })
  readonly content: string;
}
