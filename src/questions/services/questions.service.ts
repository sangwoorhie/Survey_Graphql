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

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);
  constructor(private readonly questionsRepository: Repository<Questions>) {}

  // 문항 목록조회 (getAllQuestions)
  async getAllQuestions(): Promise<Questions[]> {
    try {
      const questions = await this.questionsRepository.find({
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
  async getSingleQuestion(questionId: number): Promise<Questions> {
    try {
      return await this.questionsRepository.findOneOrFail({
        where: { id: questionId },
      });
    } catch (error) {
      this.logger.error(
        `해당 문항 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 문항 생성 (createQuestion)
  async createQuestion(createDto: CreateQuestionDto): Promise<Questions> {
    try {
      const { questionNumber, content } = createDto;
      if (!questionNumber || !content) {
        throw new BadRequestException(
          '미기입된 항목이 있습니다. 모두 작성해주세요. 문항 번호는 1번부터 5번까지 생성 가능합니다.',
        );
      }
      const existQuestion = await this.existQuestion(createDto);
      if (existQuestion.existNumber) {
        throw new ConflictException(
          '중복된 번호의 다른 문항이 이미 존재합니다. 다른 번호로 작성해주세요.',
        );
      } else if (existQuestion.existContent) {
        throw new ConflictException(
          '중복된 내용의 다른 문항이 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }
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
    questionId: number,
    updateDto: UpdateQuestionDto,
  ): Promise<Questions> {
    try {
      const question = await this.questionsRepository.findOneOrFail({
        where: { id: questionId },
      });
      const update = await this.questionsRepository.save(
        new Questions(Object.assign(question, updateDto)),
      );
      // 중복검사
      const existNumber = await this.questionsRepository.findOne({
        where: { questionNumber: update.questionNumber },
      });
      if (existNumber) {
        throw new ConflictException(
          '중복된 번호의 다른 문항이 이미 존재합니다. 다른 번호로 수정해주세요.',
        );
      }
      const existContent = await this.questionsRepository.findOne({
        where: { content: update.content },
      });
      if (existContent) {
        throw new ConflictException(
          '중복된 내용의 다른 문항이 이미 존재합니다. 다른 내용으로 수정해주세요.',
        );
      }
      return update;
    } catch (error) {
      this.logger.error(
        `해당 문항 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 문항 삭제 (deleteQuestion)
  async deleteQuestion(questionId: number): Promise<EntityWithId> {
    try {
      const question = await this.questionsRepository.findOneOrFail({
        where: { id: questionId },
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
  async existQuestion(createDto: CreateQuestionDto) {
    const { questionNumber, content } = createDto;
    const existNumber = await this.questionsRepository.findOne({
      where: { questionNumber },
    });
    const existContent = await this.questionsRepository.findOne({
      where: { content },
    });
    return { existNumber, existContent };
  }
}
