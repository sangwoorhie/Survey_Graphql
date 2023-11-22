import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateOptionDto {
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

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  readonly score: number;
}
