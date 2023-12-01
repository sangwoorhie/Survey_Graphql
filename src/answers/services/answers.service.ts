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
import { OptionsService } from 'src/options/services/options.service';
import { UpdateAnswerDto } from '../dto/update-answer.dto';
import { Surveys } from 'src/surveys/entities/surveys.entity';

@Injectable()
export class AnswersService {
  private readonly logger = new Logger(AnswersService.name);
  constructor(
    @InjectRepository(Answers)
    private readonly answersRepository: Repository<Answers>,
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
      const answers = await this.answersRepository.find({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
        },
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
      return await this.answersRepository.findOneOrFail({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          id: answerId,
        },
        relations: ['survey', 'question'],
        select: ['id', 'answerNumber'],
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
      const question = await this.questionsRepository.findOne({
        where: {
          survey: { id: surveyId },
          id: questionId,
        },
      });

      // 답변 생성 및 수정용 답안번호와 동일한 선택지번호 조회
      const { answerNumber } = createDto;
      const option = await this.optionsService.optionNumber(
        surveyId,
        questionId,
        answerNumber,
      );

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
      const question = await this.questionsRepository.findOne({
        where: {
          survey: { id: surveyId },
          id: questionId,
        },
      });
      const answer = await this.answersRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          id: answerId,
        },
      });

      if ((question.isAnswered = false) || !answer) {
        throw new BadRequestException('아직 답변이 완료되지 않은 문항입니다.');
      }

      const { answerNumber } = updateDto;

      // 답변 생성 및 수정용 답안번호와 동일한 선택지번호 조회
      const option = await this.optionsService.optionNumber(
        surveyId,
        questionId,
        answerNumber,
      );
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
      const question = await this.questionsRepository.findOne({
        where: {
          survey: { id: surveyId },
          id: questionId,
        },
      });
      const answer = await this.answersRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          id: answerId,
        },
      });
      // 답변 삭제된 문항 상태 false로 변경 및 0점처리
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
