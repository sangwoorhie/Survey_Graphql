import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';
import { SurveysRepository } from 'src/surveys/repositories/surveys.repository';
import { OptionsRepository } from 'src/options/repositories/options.repository';
import { AnswersRepository } from '../repositories/answer.repository';
import { CreateAnswerDto } from '../dto/create-answer.dto';
import { UpdateAnswerDto } from '../dto/update-answer.dto';

@Injectable()
export class AnswersService {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly surveysRepository: SurveysRepository,
    private readonly optionsRepository: OptionsRepository,
    private readonly answersRepository: AnswersRepository,
  ) {}

  // 답변 목록조회
  async getAnswers(surveyId: number, questionId: number) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const question = await this.questionsRepository.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
    }
    const answers = await this.answersRepository.getAnswers(questionId);
    if (!answers.length) {
      throw new NotFoundException('해당 문항의 답변이 아직 존재하지 않습니다.');
    }
    return answers;
  }

  // 답변 상세조회
  async getAnswerById(surveyId: number, questionId: number, answerId: number) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const question = await this.questionsRepository.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
    }
    const answer = await this.answersRepository.getAnswerById(answerId);
    if (!answer) {
      throw new NotFoundException('해당 문항의 답변이 존재하지 않습니다.');
    }
    return answer;
  }

  // 답변 생성
  async createAnswer(
    surveyId: number,
    questionId: number,
    createDto: CreateAnswerDto,
  ) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const question = await this.questionsRepository.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
    }
    const { number } = createDto;
    if (!number) {
      throw new BadRequestException(
        '답안으로 선택할 선택지의 번호를 작성해주세요. 선택지의 번호는 1부터 5까지 존재합니다.',
      );
    }
    const create = await this.answersRepository.createAnswer(createDto);
    return create;
  }

  // 답변 수정
  async updateAnswer(
    surveyId: number,
    questionId: number,
    answerId: number,
    updateDto: UpdateAnswerDto,
  ) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const question = await this.questionsRepository.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
    }
    const answer = await this.answersRepository.getAnswerById(answerId);
    if (!answer) {
      throw new NotFoundException('해당 문항의 답변이 존재하지 않습니다.');
    }
    const { newNumber } = updateDto;
    if (!newNumber) {
      throw new BadRequestException(
        '답안으로 선택할 선택지의 번호를 작성해주세요. 선택지의 번호는 1부터 5까지 존재합니다.',
      );
    }
    const update = await this.answersRepository.updateAnswer(
      answerId,
      newNumber,
    );
    return update;
  }

  // 답변 삭제
  async deleteAnswer(surveyId: number, questionId: number, answerId: number) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const question = await this.questionsRepository.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
    }
    const answer = await this.answersRepository.getAnswerById(answerId);
    if (!answer) {
      throw new NotFoundException('해당 문항의 답변이 존재하지 않습니다.');
    }
    const remove = await this.answersRepository.deleteAnswer(answerId);
    return remove;
  }
}
