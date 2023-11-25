import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateOptionDto {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  readonly optionNumber: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  readonly content: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  readonly optionScore: number;
}
