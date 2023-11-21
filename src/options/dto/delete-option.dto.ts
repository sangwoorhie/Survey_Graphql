import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class DeleteOptionDto {
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString()
  readonly password: string;
}
