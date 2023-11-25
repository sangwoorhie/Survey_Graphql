import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

@InputType()
export class CreateAnswerDto {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  readonly answerNumber: number;
}
