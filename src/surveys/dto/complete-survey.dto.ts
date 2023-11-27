import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@InputType()
export class CompleteSurveyDto {
  @Field(() => Boolean, { defaultValue: false })
  @IsNotEmpty({
    message:
      '설문지 완료 여부를 기입해주세요. 설문지가 완료되었을 경우, `true`를 작성해주세요.',
  })
  @IsBoolean()
  readonly isDone: boolean;
}
