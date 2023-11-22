import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class DeleteOptionDto {
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
