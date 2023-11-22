import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';

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

  // 문항 목록조회
  async getQuestions(surveyId: number) {
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
  }

  // 문항 상세조회
  async getQuestionById(surveyId: number, questionId: number) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const question = await this.questionsRepository.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
    }
    return question;
  }

  // 문항 생성
  async createQuestion(surveyId: number, createDto: CreateQuestionDto) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const { number, content } = createDto;
    if (!number || !content) {
      throw new BadRequestException(
        '미기입된 항목이 있습니다. 모두 작성해주세요. 문항 번호는 1번부터 5번까지 생성 가능합니다.',
      );
    }
    const questions = await this.questionsRepository.getQuestions(surveyId);
    const IsDuplicatedNumber = questions.some(
      (question) => question.number === number,
    );
    if (!IsDuplicatedNumber) {
      throw new ConflictException(
        '중복된 번호의 다른 문항이 이미 존재합니다. 문항 번호는 1번부터 5번까지 가능하며, 다른 번호로 생성해주세요.',
      );
    }
    const IsDuplicatedContent = questions.some(
      (question) => question.content === content,
    );
    if (!IsDuplicatedContent) {
      throw new ConflictException(
        '중복된 내용의 다른 문항이 이미 존재합니다. 다른 내용을 입력해주세요.',
      );
    }
    const create = await this.questionsRepository.createQuestion(createDto);
    return create;
  }

  // 문항 수정
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
    const { newNumber, newContent, password } = updateDto;
    if (!newNumber || !newContent) {
      throw new BadRequestException(
        '미기입된 항목이 있습니다. 모두 작성해주세요. 문항 번호는 1번부터 5번까지 수정 가능합니다.',
      );
    }
    const isPasswordValid = await bcrypt.compare(password, survey.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '권한이 없습니다. 비밀번호가 일치하지 않습니다.',
      );
    }

    const questions = await this.questionsRepository.getQuestions(surveyId);
    const IsDuplicatedNumber = questions.some(
      (question) => question.number === newNumber,
    );
    if (!IsDuplicatedNumber) {
      throw new ConflictException(
        '중복된 번호의 다른 문항이 이미 존재합니다. 문항 번호는 1번부터 5번까지 가능하며, 다른 번호로 수정해주세요.',
      );
    }
    const IsDuplicatedContent = questions.some(
      (question) => question.content === newContent,
    );
    if (!IsDuplicatedContent) {
      throw new ConflictException(
        '중복된 내용의 다른 문항이 이미 존재합니다. 다른 내용을 입력해주세요.',
      );
    }
    const update = await this.questionsRepository.updateQuestion(
      questionId,
      newNumber,
      newContent,
    );
    return update;
  }

  // 문항 삭제
  async deleteQuestion(
    surveyId: number,
    questionId: number,
    deleteDto: DeleteQuestionDto,
  ) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const question = await this.questionsRepository.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
    }
    const { password } = deleteDto;
    if (!password) {
      throw new BadRequestException('비밀번호를 입력해주세요.');
    }
    const isPasswordValid = await bcrypt.compare(password, survey.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '권한이 없습니다. 비밀번호가 일치하지 않습니다.',
      );
    }
    const remove = await this.questionsRepository.deleteQuestion(questionId);
    return remove;
  }
}
