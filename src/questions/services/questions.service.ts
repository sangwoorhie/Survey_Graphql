import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { QuestionsRepository } from '../repositories/questions.repository';
import { SurveysRepository } from 'src/surveys/repositories/surveys.repository';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { DeleteQuestionDto } from '../dto/delete-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly surveysRepository: SurveysRepository,
  ) {}

  // 질문 목록조회
  async getQuestions(surveyId: number) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    return survey;
  }

  // 질문 상세조회
  async getQuestionById(surveyId: number, questionId: number) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    return await this.questionsRepository.getQuestionById(questionId);
  }

  // 질문 생성
  async createQuestion(surveyId: number, createDto: CreateQuestionDto) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const { content } = createDto;
    if (!content) {
      throw new BadRequestException('질문을 작성해주세요.');
    }

    const create = await this.questionsRepository.createQuestion(content);
    return create;
  }

  // 질문 수정
  async updateQuestion(
    surveyId: number,
    questionId: number,
    updateDto: UpdateQuestionDto,
  ) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const question = await this.questionsRepository.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
    }
    const { newContent, password } = updateDto;
    if (!newContent) {
      throw new BadRequestException('질문을 작성해주세요.');
    } else if (!password) {
      throw new BadRequestException('비밀번호를 입력해주세요.');
    }

    if (survey.password !== password) {
      throw new UnauthorizedException(
        '권한이 없습니다. 설문지 비밀번호와 일치하지 않습니다.',
      );
    }
    const update = await this.questionsRepository.updateQuestion(
      questionId,
      newContent,
    );
    return update;
  }

  // 질문 삭제
  async deleteQuestion(
    surveyId: number,
    questionId: number,
    deleteDto: DeleteQuestionDto,
  ) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const { password } = deleteDto;
    if (!password) {
      throw new BadRequestException('비밀번호를 입력해주세요.');
    } else if (survey.password !== password) {
      throw new UnauthorizedException(
        '권한이 없습니다. 설문지 비밀번호와 일치하지 않습니다.',
      );
    }
    const remove = await this.questionsRepository.deleteQuestion(questionId);
    return remove;
  }
}
