import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

@InputType()
export class CreateQuestionDto {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  readonly questionNumber: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  readonly content: string;
}
