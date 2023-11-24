import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SurveyDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  @MaxLength(500)
  readonly description: string;
}
