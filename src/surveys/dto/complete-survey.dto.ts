import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@InputType()
export class CompleteSurveyDto {
  @Field(() => Boolean, { defaultValue: false })
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsBoolean()
  readonly isDone: boolean;
}
