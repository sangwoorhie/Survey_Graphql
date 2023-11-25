import { PartialType, InputType, OmitType } from '@nestjs/graphql';
import { CreateAnswerDto } from './create-answer.dto';

@InputType()
export class UpdateAnswerDto extends PartialType(
  OmitType(CreateAnswerDto, []),
) {}
