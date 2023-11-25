import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateSurveyDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  readonly title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  @MaxLength(500)
  readonly description: string;
}
