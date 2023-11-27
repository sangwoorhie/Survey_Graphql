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
      await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
      });
      await this.questionsRepository.findOneOrFail({
        where: { id: questionId },
      });
      const options = await this.optionsRepository.find({
        select: ['id', 'optionNumber', 'content'],
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
      await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
        select: ['id'],
      });
      await this.questionsRepository.findOneOrFail({
        where: { id: questionId },
        select: ['id'],
      });
      return await this.optionsRepository.findOneOrFail({
        where: { id: optionId },
        select: ['id', 'optionNumber', 'content'],
      });
    } catch (error) {
      this.logger.error(
        `해당 선택지 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 답변 생성용 옵션번호 조회
  async optionNumber(answerNumber: number): Promise<Options> {
    try {
      return await this.optionsRepository.findOneOrFail({
        where: { optionNumber: answerNumber },
      });
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
      await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
        select: ['id'],
      });
      await this.questionsRepository.findOneOrFail({
        where: { id: questionId },
        select: ['id'],
      });

      // 선택지 중복검사
      await this.existOption(surveyId, questionId, createDto);

      // 선택지 순서대로 (Sequential Numbering)
      const SequentialNumbering = await this.SequentialNumbering(
        surveyId,
        questionId,
        createDto,
      );

      const { content, optionScore } = createDto;
      const SequenceNumber = SequentialNumbering.optionNumber;
      const NewDto = { SequenceNumber, content, optionScore };

      const option = this.optionsRepository.create(NewDto);
      return await this.optionsRepository.save(option);
    } catch (error) {
      this.logger.error(
        `해당 선택지 생성 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 선택지 수정 (updateOption)
  async updateOption(
    surveyId: number,
    questionId: number,
    optionId: number,
    updateDto: UpdateOptionDto,
  ): Promise<Options> {
    try {
      await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
        select: ['id'],
      });
      await this.questionsRepository.findOneOrFail({
        where: { id: questionId },
        select: ['id'],
      });
      const option = await this.optionsRepository.findOneOrFail({
        where: { id: optionId },
      });

      const { content } = updateDto;
      const existContent = await this.optionsRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          content: content,
        },
      });
      if (existContent) {
        throw new ConflictException(
          '중복된 내용의 다른 선택지가 이미 존재합니다. 다른 내용으로 수정해주세요.',
        );
      }

      option.content = updateDto.content;
      await this.optionsRepository.save(option);
      return await this.optionsRepository.findOne({ where: { id: optionId } });
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
      await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
        select: ['id'],
      });
      await this.questionsRepository.findOneOrFail({
        where: { id: questionId },
        select: ['id'],
      });
      const option = await this.optionsRepository.findOneOrFail({
        where: { id: optionId },
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
      if (existNumber) {
        throw new ConflictException(
          '중복된 번호의 다른 선택지가 이미 존재합니다. 다른 번호로 작성해주세요.',
        );
      }

      const existContent = await this.optionsRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          content: content,
        },
      });
      if (existContent) {
        throw new ConflictException(
          '중복된 내용의 다른 선택지가 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }
      const existScore = await this.optionsRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          optionScore: optionScore,
        },
      });
      if (existScore) {
        throw new ConflictException(
          '중복된 점수의 다른 선택지가 이미 존재합니다. 다른 점수로 작성해주세요.',
        );
      }

      return createDto;
    } catch (error) {
      this.logger.error(
        `해당 선택지 생성을 위한 선택지 중복검사 중 에러가 발생했습니다: ${error.message}`,
      );
    }
  }

  // 선택지 순서대로 (Sequential Numbering)
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
      existQuestion.optionNumber === 1 &&
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
    if (
      existQuestion &&
      [1, 2, 3, 4].includes(existQuestion.optionNumber) &&
      ![5].includes(existQuestion.optionNumber) &&
      [1, 2, 3, 4].includes(optionNumber)
    ) {
      throw new BadRequestException(
        '선택지 번호는 순서대로 생성 가능합니다. 5번을 생성해주세요.',
      );
    }
    return createDto;
  }
}
