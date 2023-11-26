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
      // const existOption = await this.existOption(createDto);
      // if (existOption.existNumber) {
      //   throw new ConflictException(
      //     '중복된 번호의 다른 선택지가 이미 존재합니다. 다른 번호로 작성해주세요.',
      //   );
      // } else if (existOption.existContent) {
      //   throw new ConflictException(
      //     '중복된 내용의 다른 선택지가 이미 존재합니다. 다른 내용으로 작성해주세요.',
      //   );
      // } else if (existOption.existScore) {
      //   throw new ConflictException(
      //     '중복된 점수의 다른 선택지가 이미 존재합니다. 다른 점수로 작성해주세요.',
      //   );
      // }
      return await this.optionsRepository.save(new Options(createDto));
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
      const update = await this.optionsRepository.save(
        new Options(Object.assign(option, updateDto)),
      );
      // 중복검사
      // const existNumber = await this.optionsRepository.findOne({
      //   where: { optionNumber: update.optionNumber },
      // });
      // if (existNumber) {
      //   throw new ConflictException(
      //     '중복된 번호의 다른 선택지가 이미 존재합니다. 다른 번호로 수정해주세요.',
      //   );
      // }
      // const existContent = await this.optionsRepository.findOne({
      //   where: { content: update.content },
      // });
      // if (existContent) {
      //   throw new ConflictException(
      //     '중복된 내용의 다른 선택지가 이미 존재합니다. 다른 내용으로 수정해주세요.',
      //   );
      // }
      // const existScore = await this.optionsRepository.findOne({
      //   where: { optionScore: update.optionScore },
      // });
      // if (existScore) {
      //   throw new ConflictException(
      //     '중복된 점수의 다른 선택지가 이미 존재합니다. 다른 점수로 수정해주세요.',
      //   );
      // }
      return update;
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
  async existOption(createDto: CreateOptionDto) {
    try {
      const { optionNumber, content, optionScore } = createDto;
      const existNumber = await this.optionsRepository.findOne({
        where: { optionNumber },
      });
      const existContent = await this.optionsRepository.findOne({
        where: { content },
      });
      const existScore = await this.optionsRepository.findOne({
        where: { optionScore },
      });
      return { existNumber, existContent, existScore };
    } catch (error) {
      this.logger.error(
        `해당 선택지 생성을 위한 선택지 중복검사 중 에러가 발생했습니다: ${error.message}`,
      );
    }
  }
}
