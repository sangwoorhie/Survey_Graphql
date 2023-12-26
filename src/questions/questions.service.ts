import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Repository } from 'typeorm';
import { Questions } from '../entities/questions.entity';
import { EntityWithId } from 'src/survey.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Surveys } from 'src/entities/surveys.entity';
import { Users } from 'src/entities/user.entity';

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
        relations: ['survey', 'options'],
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
    user: Users,
  ): Promise<Questions> {
    try {
      await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
        relations: ['user'],
      });

      if (user.status !== 'teacher') {
        throw new UnauthorizedException('선생님만 문항을 생성할 수 있습니다.');
      }

      // 문항 생성
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

      const newQuestion = this.questionsRepository.create({
        userId: user.id,
        surveyId,
        questionNumber,
        content,
      });
      return await this.questionsRepository.save(newQuestion);
    } catch (error) {
      this.logger.error(
        `해당 문항 생성 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 문항 수정 (updateQuestion) => 내용(content)만 수정 가능
  async updateQuestion(
    surveyId: number,
    questionId: number,
    updateDto: UpdateQuestionDto,
    user: Users,
  ): Promise<Questions> {
    try {
      const question = await this.questionsRepository.findOneOrFail({
        where: {
          survey: { id: surveyId },
          id: questionId,
        },
        relations: ['user'],
      });
      // 문항 생성자만 수정가능, (문항 생성자가 선생님이라는것은 생성시 이미 검증됨)
      if (question.userId !== user.id) {
        throw new ForbiddenException('문항을 생성한 본인만 수정이 가능합니다.');
      }

      const existContent = await this.questionsRepository.findOne({
        where: {
          survey: { id: surveyId },
          content: updateDto.content,
        },
      });
      if (existContent) {
        throw new BadRequestException(
          '중복된 내용의 다른 문항이 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }

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
    user: Users,
  ): Promise<EntityWithId> {
    try {
      const question = await this.questionsRepository.findOneOrFail({
        where: {
          survey: { id: surveyId },
          id: questionId,
        },
        relations: ['user'],
      });

      // 문항 생성자만 삭제가능 (생성자가 선생님이라는것은 생성시 이미 검증됨)
      if (question.userId !== user.id) {
        throw new ForbiddenException('문항을 생성한 본인만 삭제가 가능합니다.');
      }

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
