import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteSurveyDto {
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
