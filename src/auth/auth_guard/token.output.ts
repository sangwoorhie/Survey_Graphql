import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class TokenOutput {
  constructor(partial?: Partial<TokenOutput>) {
    Object.assign(this, partial);
  }

  @Field()
  @IsString()
  token: string;
}
