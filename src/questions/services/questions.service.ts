import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { QuestionsRepository } from '../repositories/questions.repository';
import { SurveysRepository } from 'src/surveys/repositories/surveys.repository';
import { QuestionDto } from '../dto/question.dto';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly surveysRepository: SurveysRepository,
  ) {}

  // 문항 목록조회
  async getQuestions(surveyId: number) {
    try {
      const survey = await this.surveysRepository.getSurveyById(surveyId);
      if (!survey) {
        throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
      }
      const questions = await this.questionsRepository.getQuestions(surveyId);
      if (!questions.length) {
        throw new NotFoundException(
          '해당 설문지의 문항이 아직 존재하지 않습니다.',
        );
      }
      return questions;
    } catch (error) {
      this.logger.error(
        `문항 목록 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 문항 상세조회
  async getQuestionById(surveyId: number, questionId: number) {
    try {
      const survey = await this.surveysRepository.getSurveyById(surveyId);
      if (!survey) {
        throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
      }
      const question =
        await this.questionsRepository.getQuestionById(questionId);
      if (!question) {
        throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
      }
      return question;
    } catch (error) {
      this.logger.error(
        `해당 문항 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 문항 생성
  async createQuestion(surveyId: number, questionDto: QuestionDto) {
    try {
      const survey = await this.surveysRepository.getSurveyById(surveyId);
      if (!survey) {
        throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
      }
      const { number, content } = questionDto;
      if (!number || !content) {
        throw new BadRequestException(
          '미기입된 항목이 있습니다. 모두 작성해주세요. 문항 번호는 1번부터 5번까지 생성 가능합니다.',
        );
      }
      const IsExistQuestion = await this.questionsRepository.existQuestion(
        surveyId,
        number,
        content,
      );
      if (IsExistQuestion.IsExistNumber) {
        throw new ConflictException(
          '중복된 번호의 다른 문항이 이미 존재합니다. 다른 번호로 작성해주세요.',
        );
      } else if (IsExistQuestion.IsExistContent) {
        throw new ConflictException(
          '중복된 내용의 다른 문항이 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }
      const create = await this.questionsRepository.createQuestion(
        surveyId,
        number,
        content,
      );
      return create;
    } catch (error) {
      this.logger.error(
        `해당 문항 생성 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 문항 수정
  async updateQuestion(
    surveyId: number,
    questionId: number,
    questionDto: QuestionDto,
  ) {
    try {
      const survey = await this.surveysRepository.getSurveyById(surveyId);
      if (!survey) {
        throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
      }
      const question =
        await this.questionsRepository.getQuestionById(questionId);
      if (!question) {
        throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
      }
      const { number, content } = questionDto;
      if (!number || !content) {
        throw new BadRequestException(
          '미기입된 항목이 있습니다. 모두 작성해주세요. 문항 번호는 1번부터 5번까지 수정 가능합니다.',
        );
      }
      const IsExistQuestion = await this.questionsRepository.existQuestion(
        surveyId,
        number,
        content,
      );
      if (IsExistQuestion.IsExistNumber) {
        throw new ConflictException(
          '중복된 번호의 다른 문항이 이미 존재합니다. 다른 번호로 작성해주세요.',
        );
      } else if (IsExistQuestion.IsExistContent) {
        throw new ConflictException(
          '중복된 내용의 다른 문항이 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }
      const update = await this.questionsRepository.updateQuestion(
        questionId,
        number,
        content,
      );
      return update;
    } catch (error) {
      this.logger.error(
        `해당 문항 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 문항 삭제
  async deleteQuestion(surveyId: number, questionId: number) {
    try {
      const survey = await this.surveysRepository.getSurveyById(surveyId);
      if (!survey) {
        throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
      }
      const question =
        await this.questionsRepository.getQuestionById(questionId);
      if (!question) {
        throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
      }
      const remove = await this.questionsRepository.deleteQuestion(questionId);
      return remove;
    } catch (error) {
      this.logger.error(
        `해당 문항 삭제 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }
}
