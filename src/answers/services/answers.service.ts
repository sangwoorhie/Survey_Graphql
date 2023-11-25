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

@Injectable()
export class AnswersService {
  private readonly logger = new Logger(AnswersService.name);
  constructor(
    private readonly answersRepository: Repository<Answers>,
    private readonly optionsService: OptionsService,
    private readonly questionsService: QuestionsService,
  ) {}

  // 답변 목록조회 (getAllAnswers)
  async getAllAnswers(): Promise<Answers[]> {
    try {
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
  async getSingleAnswer(answerId: number): Promise<Answers> {
    try {
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
  async createAnswer(createDto: CreateAnswerDto): Promise<Answers> {
    try {
      const { answerNumber } = createDto;
      if (!answerNumber) {
        throw new BadRequestException(
          '답안으로 선택할 선택지의 번호를 작성해주세요.',
        );
      }
      const optionNumber = await this.optionsService.optionNumber(answerNumber);
      if (!optionNumber) {
        throw new NotFoundException('해당 번호의 선택지가 존재하지 않습니다.');
      } // 해당 suerveyId, questionId일치 여부 확인해야함(안되어있음)

      const answer = await this.answersRepository.save(new Answers(createDto));
      if (answer) {
      }
      // (답변확인처리) 조건문에 해당 question의 isAnswered를 true로 변경시키는 로직 필요함
      // isAnswered가 이미 true일 경우, 이미 답변된 문항이라고 에러메시지 반환
      // (점수생성) 해당 question의 questionScore를 선택된 option의 optionScore로 일치시켜서 반환하는 로직 필요함
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
    answerId: number,
    updateDto: UpdateAnswerDto,
  ): Promise<Answers> {
    try {
      const answer = await this.answersRepository.findOneOrFail({
        where: { id: answerId },
      });
      const update = await this.answersRepository.save(
        new Answers(Object.assign(answer, updateDto)),
      );
      return update;
      // 기존에 isAnswered=true 된 것만 변경처리 가능함.
      // (답변확인처리) 해당 question의 isAnswered=true로 다시 한번 써주고,
      // (점수생성) questionScore를 선택된 option의 optionScore로 일치 변경시켜서 반환하는 로직 필요함
    } catch (error) {
      this.logger.error(
        `해당 답변 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 답변 삭제 (deleteAnswer)
  async deleteAnswer(answerId: number): Promise<EntityWithId> {
    try {
      const answer = await this.answersRepository.findOneOrFail({
        where: { id: answerId },
      });
      await this.answersRepository.remove(answer);
      return new EntityWithId(answerId);
      // 해당 question의 isAnswered를 false로 하고, score를 0으로 반환하는 로직 필요
    } catch (error) {
      this.logger.error(
        `해당 답변 삭제 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }
}
