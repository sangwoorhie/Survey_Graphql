import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class DeleteUserDto {
  @Field()
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsString()
  readonly password: string;
}
