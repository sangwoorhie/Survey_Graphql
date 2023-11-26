import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateAnswerDto } from '../dto/create-answer.dto';
import { Repository } from 'typeorm';
import { Answers } from '../entities/answers.entity';
import { EntityWithId } from 'src/survey.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Questions } from 'src/questions/entities/questions.entity';
import { Options } from 'src/options/entities/options.entity';
import { OptionsService } from 'src/options/services/options.service';
import { QuestionsService } from 'src/questions/services/questions.service';
import { UpdateAnswerDto } from '../dto/update-answer.dto';
import { Surveys } from 'src/surveys/entities/surveys.entity';

@Injectable()
export class AnswersService {
  private readonly logger = new Logger(AnswersService.name);
  constructor(
    @InjectRepository(Answers)
    private readonly answersRepository: Repository<Answers>,
    @InjectRepository(Surveys)
    private readonly surveysRepository: Repository<Surveys>,
    @InjectRepository(Questions)
    private readonly questionsRepository: Repository<Questions>,
    private readonly optionsService: OptionsService,
  ) {}

  // 답변 목록조회 (getAllAnswers)
  async getAllAnswers(
    surveyId: number,
    questionId: number,
  ): Promise<Answers[]> {
    try {
      await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
      });
      await this.questionsRepository.findOneOrFail({
        where: { id: questionId },
      });
      const answers = await this.answersRepository.find({
        select: ['id', 'answerNumber'],
      });
      if (!answers.length) {
        throw new NotFoundException(
          '해당 문항의 답변이 아직 존재하지 않습니다.',
        );
      }
      return answers;
    } catch (error) {
      this.logger.error(
        `답변 목록 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 단일 답변조회 (getSingleAnswer)
  async getSingleAnswer(
    surveyId: number,
    questionId: number,
    answerId: number,
  ): Promise<Answers> {
    try {
      await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
      });
      await this.questionsRepository.findOneOrFail({
        where: { id: questionId },
      });
      return await this.answersRepository.findOneOrFail({
        where: { id: answerId },
      });
    } catch (error) {
      this.logger.error(
        `해당 답변 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 답변 생성 (createAnswer)
  async createAnswer(
    surveyId: number,
    questionId: number,
    createDto: CreateAnswerDto,
  ): Promise<Answers> {
    try {
      await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
      });
      const question = await this.questionsRepository.findOneOrFail({
        where: { id: questionId },
      });
      if ((question.isAnswered = true)) {
        throw new BadRequestException('이미 답변이 완료된 문항입니다.');
      }
      const { answerNumber } = createDto;
      const option = await this.optionsService.optionNumber(answerNumber);

      const create = this.answersRepository.create(createDto);
      const answer = await this.answersRepository.save(create);

      // 답변된 문항 상태 true로 변경 및 선택된 옵션으로 점수부여
      if (option && answer) {
        question.isAnswered = true;
        question.questionScore = option.optionScore;
        await this.questionsRepository.save(question);
      }
      return answer;
    } catch (error) {
      this.logger.error(
        `해당 답변 생성 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 답변 수정 (updateAnswer)
  async updateAnswer(
    surveyId: number,
    questionId: number,
    answerId: number,
    updateDto: UpdateAnswerDto,
  ): Promise<Answers> {
    try {
      await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
      });
      const question = await this.questionsRepository.findOneOrFail({
        where: { id: questionId },
      });
      if ((question.isAnswered = false)) {
        throw new BadRequestException('아직 답변이 완료되지 않은 문항입니다.');
      }
      await this.answersRepository.findOneOrFail({
        where: { id: answerId },
      });
      const { answerNumber } = updateDto;

      const option = await this.optionsService.optionNumber(answerNumber);
      const update = await this.answersRepository.update(
        { id: answerId },
        { answerNumber: answerNumber },
      );
      // 답변된 문항 상태 true로 변경 및 선택된 옵션으로 점수부여
      if (option && update) {
        question.isAnswered = true;
        question.questionScore = option.optionScore;
        await this.questionsRepository.save(question);
      }
      return await this.answersRepository.findOne({ where: { id: answerId } });
    } catch (error) {
      this.logger.error(
        `해당 답변 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 답변 삭제 (deleteAnswer)
  async deleteAnswer(
    surveyId: number,
    questionId: number,
    answerId: number,
  ): Promise<EntityWithId> {
    try {
      await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
      });
      const question = await this.questionsRepository.findOneOrFail({
        where: { id: questionId },
      });
      const answer = await this.answersRepository.findOneOrFail({
        where: { id: answerId },
      });
      const remove = await this.answersRepository.remove(answer);
      if (remove) {
        question.isAnswered = false;
        question.questionScore = 0;
        await this.questionsRepository.save(question);
      }
      return new EntityWithId(answerId);
    } catch (error) {
      this.logger.error(
        `해당 답변 삭제 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }
}
