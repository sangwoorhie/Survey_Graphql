import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateOptionDto } from '../dto/create-option.dto';
import { Repository } from 'typeorm';
import { Options } from '../entities/options.entity';
import { EntityWithId } from 'src/survey.type';
import { UpdateOptionDto } from '../dto/update-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Surveys } from 'src/surveys/entities/surveys.entity';
import { Questions } from 'src/questions/entities/questions.entity';

@Injectable()
export class OptionsService {
  private readonly logger = new Logger(OptionsService.name);
  constructor(
    @InjectRepository(Surveys)
    private readonly surveysRepository: Repository<Surveys>,
    @InjectRepository(Questions)
    private readonly questionsRepository: Repository<Questions>,
    @InjectRepository(Options)
    private readonly optionsRepository: Repository<Options>,
  ) {}

  // 선택지 목록조회 (getAllOptions)
  async getAllOptions(
    surveyId: number,
    questionId: number,
  ): Promise<Options[]> {
    try {
      const options = await this.optionsRepository.find({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
        },
      });
      if (!options.length) {
        throw new NotFoundException('선택지가 아직 존재하지 않습니다.');
      }
      return options;
    } catch (error) {
      this.logger.error(
        `선택지 목록 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 단일 선택지 조회 (getSingleOption)
  async getSingleOption(
    surveyId: number,
    questionId: number,
    optionId: number,
  ): Promise<Options> {
    try {
      return await this.optionsRepository.findOneOrFail({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          id: optionId,
        },
        select: ['id', 'optionNumber', 'content', 'optionScore'],
        // relations: ['survey', 'question'],
      });
    } catch (error) {
      this.logger.error(
        `해당 선택지 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 답변 생성 및 수정용 답안번호와 동일한 선택지번호 조회
  async optionNumber(
    surveyId: number,
    questionId: number,
    answerNumber: number,
  ): Promise<Options> {
    try {
      const matching = await this.optionsRepository.findOne({
        where: {
          surveyId,
          questionId,
          optionNumber: answerNumber,
        },
      });
      if (!matching) {
        throw new NotFoundException('해당 선택지 번호가 존재하지 않습니다.');
      }
      return matching;
    } catch (error) {
      this.logger.error(
        `답변 생성을 위한 선택지번호 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 선택지 생성 (createOption)
  async createOption(
    surveyId: number,
    questionId: number,
    createDto: CreateOptionDto,
  ): Promise<Options> {
    try {
      await this.questionsRepository.findOneOrFail({
        where: {
          survey: { id: surveyId },
          id: questionId,
        },
      });

      // 선택지 중복검사
      const option = await this.existOption(surveyId, questionId, createDto);
      if (option.existNumber) {
        throw new ConflictException(
          '중복된 번호의 다른 선택지가 이미 존재합니다. 다른 번호로 작성해주세요.',
        );
      }
      if (option.existContent) {
        throw new ConflictException(
          '중복된 내용의 다른 선택지가 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }
      if (option.existScore) {
        throw new ConflictException(
          '중복된 점수의 다른 선택지가 이미 존재합니다. 다른 점수로 작성해주세요.',
        );
      }

      // 선택지 순서대로 (Sequential Numbering)
      // await this.SequentialNumbering(surveyId, questionId, createDto);

      const { optionNumber, content, optionScore } = createDto;
      const newOption = this.optionsRepository.create({
        surveyId,
        questionId,
        optionNumber,
        content,
        optionScore,
      });
      return await this.optionsRepository.save(newOption);
    } catch (error) {
      this.logger.error(
        `해당 선택지 생성 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 선택지 수정 (updateOption) => 내용(content)만 수정 가능
  async updateOption(
    surveyId: number,
    questionId: number,
    optionId: number,
    updateDto: UpdateOptionDto,
  ): Promise<Options> {
    try {
      const option = await this.optionsRepository.findOneOrFail({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          id: optionId,
        },
      });

      const existContent = await this.optionsRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          content: updateDto.content,
        },
      });

      if (existContent) {
        throw new BadRequestException(
          '중복된 내용의 다른 선택지가 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }

      await this.optionsRepository.update(
        { surveyId, questionId, id: optionId },
        { content: updateDto.content },
      );

      return await this.optionsRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          id: optionId,
        },
      });
    } catch (error) {
      this.logger.error(
        `해당 선택지 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 선택지 삭제 (deleteOption)
  async deleteOption(
    surveyId: number,
    questionId: number,
    optionId: number,
  ): Promise<EntityWithId> {
    try {
      const option = await this.optionsRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          id: optionId,
        },
      });
      await this.optionsRepository.remove(option);
      return new EntityWithId(optionId);
    } catch (error) {
      this.logger.error(
        `해당 선택지 삭제 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 선택지 중복검사
  async existOption(
    surveyId: number,
    questionId: number,
    createDto: CreateOptionDto,
  ) {
    try {
      const { optionNumber, content, optionScore } = createDto;

      const existNumber = await this.optionsRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          optionNumber: optionNumber,
        },
      });
      const existContent = await this.optionsRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          content: content,
        },
      });
      const existScore = await this.optionsRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          optionScore: optionScore,
        },
      });
      return { existNumber, existContent, existScore };
    } catch (error) {
      this.logger.error(
        `해당 선택지 생성을 위한 선택지 중복검사 중 에러가 발생했습니다: ${error.message}`,
      );
    }
  }

  // 선택지 순서대로 (Sequential Numbering) => 사용X, 추후 리팩토링 예정
  async SequentialNumbering(
    surveyId: number,
    questionId: number,
    createDto: CreateOptionDto,
  ) {
    const { optionNumber } = createDto;

    const existQuestion = await this.optionsRepository.findOne({
      where: {
        survey: { id: surveyId },
        question: { id: questionId },
      },
    });
    // existOption.optionNumber이 없는데 optionNumber를 1이 아닌 숫자를 생성하는 경우
    if (optionNumber !== 1 && !existQuestion.optionNumber) {
      throw new BadRequestException(
        '선택지 번호는 순서대로 생성 가능합니다. 1번을 생성해주세요.',
      );
      // existOption.optionNumber에 1번이 있는데, 2번이 없고, optionNumber가 1, 3, 4, 5 중 하나인 경우
    }
    if (
      existQuestion &&
      [1].includes(existQuestion.optionNumber) &&
      ![2].includes(optionNumber) &&
      [1, 3, 4, 5].includes(optionNumber)
    ) {
      throw new BadRequestException(
        '선택지 번호는 순서대로 생성 가능합니다. 2번을 생성해주세요.',
      );
    }
    // existOption.optionNumber에 1, 2번이 있는데, 3번이 없고, optionNumber가 1, 2, 4, 5 중 하나인 경우
    if (
      existQuestion &&
      [1, 2].includes(existQuestion.optionNumber) &&
      ![3].includes(existQuestion.optionNumber) &&
      [1, 2, 4, 5].includes(optionNumber)
    ) {
      throw new BadRequestException(
        '선택지 번호는 순서대로 생성 가능합니다. 3번을 생성해주세요.',
      );
    }
    // existOption.optionNumber에 1, 2, 3번이 있는데, 4번이 없고, optionNumber가 1, 2, 3, 5 중 하나인 경우
    if (
      existQuestion &&
      [1, 2, 3].includes(existQuestion.optionNumber) &&
      ![4].includes(existQuestion.optionNumber) &&
      [1, 2, 3, 5].includes(optionNumber)
    ) {
      throw new BadRequestException(
        '선택지 번호는 순서대로 생성 가능합니다. 4번을 생성해주세요.',
      );
    }
    // existOption.optionNumber에 1, 2, 3, 4번이 있는데, 5번이 없고, optionNumber가 1, 2, 3, 4 중 하나인 경우
    const oneToFour = [1, 2, 3, 4];
    const numbersToCheckOneToFour = [1, 2, 3, 4];
    const allNumbersIncluded = numbersToCheckOneToFour.every((number) =>
      oneToFour.includes(number),
    );
    if (
      allNumbersIncluded &&
      ![5].includes(existQuestion.optionNumber) &&
      [1, 2, 3, 4].includes(optionNumber)
    ) {
      throw new BadRequestException(
        '선택지 번호는 순서대로 생성 가능합니다. 5번을 생성해주세요.',
      );
    }
  }
}
