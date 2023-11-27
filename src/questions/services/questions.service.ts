import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { Repository } from 'typeorm';
import { Questions } from '../entities/questions.entity';
import { EntityWithId } from 'src/survey.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Surveys } from 'src/surveys/entities/surveys.entity';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);
  constructor(
    @InjectRepository(Surveys)
    private readonly surveysRepository: Repository<Surveys>,
    @InjectRepository(Questions)
    private readonly questionsRepository: Repository<Questions>,
  ) {}

  // 문항 목록조회 (getAllQuestions)
  async getAllQuestions(surveyId: number): Promise<Questions[]> {
    try {
      const questions = await this.questionsRepository.find({
        where: {
          survey: { id: surveyId },
        },
        select: ['id', 'questionNumber', 'content'],
      });
      if (!questions.length) {
        throw new NotFoundException('문항이 아직 존재하지 않습니다.');
      }
      return questions;
    } catch (error) {
      this.logger.error(
        `문항 목록 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 단일 문항 조회 (getSingleQuestion)
  async getSingleQuestion(
    surveyId: number,
    questionId: number,
  ): Promise<Questions> {
    try {
      return await this.questionsRepository.findOneOrFail({
        where: {
          survey: { id: surveyId },
          id: questionId,
        },
      });
    } catch (error) {
      this.logger.error(
        `해당 문항 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 문항 생성 (createQuestion)
  async createQuestion(
    surveyId: number,
    createDto: CreateQuestionDto,
  ): Promise<Questions> {
    try {
      await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
      });

      //문항 중복검사
      await this.existQuestion(surveyId, createDto);

      return await this.questionsRepository.save(new Questions(createDto));
    } catch (error) {
      this.logger.error(
        `해당 문항 생성 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 문항 수정 (updateQuestion)
  async updateQuestion(
    surveyId: number,
    questionId: number,
    updateDto: UpdateQuestionDto,
  ): Promise<Questions> {
    try {
      const question = await this.questionsRepository.findOneOrFail({
        where: {
          survey: { id: surveyId },
          id: questionId,
        },
      });
      await this.questionsRepository.save(
        new Questions(Object.assign(question, updateDto)),
      );
      return await this.questionsRepository.findOne({
        where: { id: questionId },
      });
    } catch (error) {
      this.logger.error(
        `해당 문항 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 문항 삭제 (deleteQuestion)
  async deleteQuestion(
    surveyId: number,
    questionId: number,
  ): Promise<EntityWithId> {
    try {
      const question = await this.questionsRepository.findOneOrFail({
        where: {
          survey: { id: surveyId },
          id: questionId,
        },
      });
      await this.questionsRepository.remove(question);
      return new EntityWithId(questionId);
    } catch (error) {
      this.logger.error(
        `해당 문항 삭제 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 문항 중복검사
  async existQuestion(surveyId: number, createDto: CreateQuestionDto) {
    try {
      const { questionNumber, content } = createDto;
      const existNumber = await this.questionsRepository.findOne({
        where: {
          survey: { id: surveyId },
          questionNumber: questionNumber,
        },
      });
      if (existNumber) {
        throw new ConflictException(
          '중복된 번호의 다른 문항이 이미 존재합니다. 다른 번호로 작성해주세요.',
        );
      }
      const existContent = await this.questionsRepository.findOne({
        where: {
          survey: { id: surveyId },
          content,
        },
      });
      if (existContent) {
        throw new ConflictException(
          '중복된 내용의 다른 문항이 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }
    } catch (error) {
      this.logger.error(
        `해당 문항 생성을 위한 문항 중복검사 중 에러가 발생했습니다: ${error.message}`,
      );
    }
  }
}
