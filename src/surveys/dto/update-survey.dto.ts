import { PartialType, InputType, OmitType } from '@nestjs/graphql';
import { CreateSurveyDto } from './create-survey.dto';

@InputType()
export class UpdateSurveyDto extends PartialType(
  OmitType(CreateSurveyDto, []),
) {}
