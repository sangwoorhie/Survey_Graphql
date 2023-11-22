import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class UpdateAnswerDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  readonly newNumber: number;
}
