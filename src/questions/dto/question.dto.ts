import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class QuestionDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  readonly number: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  readonly content: string;
}
