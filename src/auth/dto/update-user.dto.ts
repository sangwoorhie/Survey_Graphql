import { PartialType, InputType, OmitType } from '@nestjs/graphql';
import { CreateUserDto } from './create-user.dto';

@InputType()
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email']),
  // ['email', 'verifyNumberInput'] 필드는 수정 불가
) {}
