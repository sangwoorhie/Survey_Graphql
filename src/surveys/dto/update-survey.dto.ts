import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateSurveyDto {
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  readonly newTitle: string;

  @IsString()
  @MinLength(20)
  @MaxLength(500)
  readonly newDescription: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
