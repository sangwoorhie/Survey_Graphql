import { PartialType, InputType, OmitType } from '@nestjs/graphql';
import { CreateQuestionDto } from './create-question.dto';

@InputType()
export class UpdateQuestionDto extends PartialType(
  OmitType(CreateQuestionDto, []),
) {}
