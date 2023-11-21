import { Injectable } from '@nestjs/common';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';
import { SurveysRepository } from 'src/surveys/repositories/surveys.repository';
import { OptionsRepository } from 'src/options/repositories/options.repository';
import { AnswersRepository } from '../repositories/answer.repository';

@Injectable()
export class AnswersService {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly surveysRepository: SurveysRepository,
    private readonly optionsRepository: OptionsRepository,
    private readonly answersRepository: AnswersRepository,
  ) {}

  // 생성
  // 조회
  // 수정
  // 삭제
}
