import { PartialType, InputType, OmitType } from '@nestjs/graphql';
import { CreateOptionDto } from './create-option.dto';

@InputType()
export class UpdateOptionDto extends PartialType(
  OmitType(CreateOptionDto, []),
) {}
