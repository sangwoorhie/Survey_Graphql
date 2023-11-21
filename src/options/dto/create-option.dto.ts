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
  @IsNotEmpty({ message: '선택지 내용을 작성해주세요.' })
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
