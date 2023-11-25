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

@Injectable()
export class OptionsService {
  private readonly logger = new Logger(OptionsService.name);
  constructor(private readonly optionsRepository: Repository<Options>) {}

  // 선택지 목록조회 (getAllOptions)
  async getAllOptions(): Promise<Options[]> {
    try {
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
  async getSingleOption(optionId: number): Promise<Options> {
    try {
      return await this.optionsRepository.findOneOrFail({
        where: { id: optionId },
      });
    } catch (error) {
      this.logger.error(
        `해당 선택지 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 답변 생성용 옵션번호 조회 // 해당 suerveyId, questionId일치 여부 확인해야함
  async optionNumber(answerNumber: number): Promise<Options> {
    try {
      return await this.optionsRepository.findOne({
        where: { optionNumber: answerNumber },
      });
    } catch (error) {
      this.logger.error(
        `해당 선택지 번호 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 선택지 생성 (createOption)
  async createOption(createDto: CreateOptionDto): Promise<Options> {
    try {
      const { optionNumber, content, optionScore } = createDto;
      if (!optionNumber || !content || !optionScore) {
        throw new BadRequestException(
          '미기입된 항목이 있습니다. 모두 작성해주세요. 선택지 번호 및 점수는 각각 1부터 5까지 생성 가능합니다.',
        );
      }
      const existOption = await this.existOption(createDto);
      if (existOption.existNumber) {
        throw new ConflictException(
          '중복된 번호의 다른 선택지가 이미 존재합니다. 다른 번호로 작성해주세요.',
        );
      } else if (existOption.existContent) {
        throw new ConflictException(
          '중복된 내용의 다른 선택지가 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      } else if (existOption.existScore) {
        throw new ConflictException(
          '중복된 점수의 다른 선택지가 이미 존재합니다. 다른 점수로 작성해주세요.',
        );
      }
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
    optionId: number,
    updateDto: UpdateOptionDto,
  ): Promise<Options> {
    try {
      const option = await this.optionsRepository.findOneOrFail({
        where: { id: optionId },
      });
      const update = await this.optionsRepository.save(
        new Options(Object.assign(option, updateDto)),
      );
      // 중복검사
      const existNumber = await this.optionsRepository.findOne({
        where: { optionNumber: update.optionNumber },
      });
      if (existNumber) {
        throw new ConflictException(
          '중복된 번호의 다른 선택지가 이미 존재합니다. 다른 번호로 수정해주세요.',
        );
      }
      const existContent = await this.optionsRepository.findOne({
        where: { content: update.content },
      });
      if (existContent) {
        throw new ConflictException(
          '중복된 내용의 다른 선택지가 이미 존재합니다. 다른 내용으로 수정해주세요.',
        );
      }
      const existScore = await this.optionsRepository.findOne({
        where: { optionScore: update.optionScore },
      });
      if (existScore) {
        throw new ConflictException(
          '중복된 점수의 다른 선택지가 이미 존재합니다. 다른 점수로 수정해주세요.',
        );
      }
      return update;
    } catch (error) {
      this.logger.error(
        `해당 선택지 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 선택지 삭제 (deleteOption)
  async deleteOption(optionId: number): Promise<EntityWithId> {
    try {
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
  }
}
