import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateOptionDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  readonly newNumber: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  readonly newContent: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  readonly newScore: number;
}
