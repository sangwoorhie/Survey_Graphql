import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  readonly number: number;
}
