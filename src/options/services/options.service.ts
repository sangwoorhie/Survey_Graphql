import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OptionsRepository } from '../repositories/options.repository';
import { SurveysRepository } from 'src/surveys/repositories/surveys.repository';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';
import { OptionDto } from '../dto/option.dto';

@Injectable()
export class OptionsService {
  private readonly logger = new Logger(OptionsService.name);
  constructor(
    private readonly optionsRepository: OptionsRepository,
    private readonly surveysRepository: SurveysRepository,
    private readonly questionsRepository: QuestionsRepository,
  ) {}

  // 선택지 목록조회
  async getOptions(surveyId: number, questionId: number) {
    try {
      const survey = await this.surveysRepository.getSurveyById(surveyId);
      if (!survey) {
        throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
      }
      const question =
        await this.questionsRepository.getQuestionById(questionId);
      if (!question) {
        throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
      }
      const options = await this.optionsRepository.getOptions(questionId);
      if (!options.length) {
        throw new NotFoundException(
          '해당 문항의 선택지가 아직 존재하지 않습니다.',
        );
      }
      return options;
    } catch (error) {
      this.logger.error(
        `선택지 목록 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 선택지 상세조회
  async getOptionById(surveyId: number, questionId: number, optionId: number) {
    try {
      const survey = await this.surveysRepository.getSurveyById(surveyId);
      if (!survey) {
        throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
      }
      const question =
        await this.questionsRepository.getQuestionById(questionId);
      if (!question) {
        throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
      }
      const option = await this.optionsRepository.getOptionById(optionId);
      if (!option) {
        throw new NotFoundException('해당 선택지를 찾을 수 없습니다.');
      }
      return option;
    } catch (error) {
      this.logger.error(
        `해당 선택지 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 선택지 생성
  async createOption(
    surveyId: number,
    questionId: number,
    optionDto: OptionDto,
  ) {
    try {
      const survey = await this.surveysRepository.getSurveyById(surveyId);
      if (!survey) {
        throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
      }
      const question =
        await this.questionsRepository.getQuestionById(questionId);
      if (!question) {
        throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
      }
      const { number, content, score } = optionDto;
      if (!number || !content || !score) {
        throw new BadRequestException(
          '미기입된 항목이 있습니다. 모두 작성해주세요. 선택지 번호 및 점수는 각각 1부터 5까지 생성 가능합니다.',
        );
      }
      const IsExistOption = await this.optionsRepository.existOption(
        surveyId,
        questionId,
        number,
        content,
        score,
      );
      if (IsExistOption.IsExistNumber) {
        throw new ConflictException(
          '중복된 번호의 다른 선택지가 이미 존재합니다. 다른 번호로 작성해주세요.',
        );
      } else if (IsExistOption.IsExistContent) {
        throw new ConflictException(
          '중복된 내용의 다른 선택지가 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      } else if (IsExistOption.IsExistScore) {
        throw new ConflictException(
          '중복된 점수의 다른 선택지가 이미 존재합니다. 다른 점수로 작성해주세요.',
        );
      }
      const create = await this.optionsRepository.createOption(
        surveyId,
        questionId,
        number,
        content,
        score,
      );
      return create;
    } catch (error) {
      this.logger.error(
        `해당 선택지 생성 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 선택지 수정
  async updateOption(
    surveyId: number,
    questionId: number,
    optionId: number,
    optionDto: OptionDto,
  ) {
    try {
      const survey = await this.surveysRepository.getSurveyById(surveyId);
      if (!survey) {
        throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
      }
      const question =
        await this.questionsRepository.getQuestionById(questionId);
      if (!question) {
        throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
      }
      const option = await this.optionsRepository.getOptionById(optionId);
      if (!option) {
        throw new NotFoundException('해당 선택지를 찾을 수 없습니다.');
      }
      const { number, content, score } = optionDto;
      if (!number || !content || !score) {
        throw new BadRequestException(
          '미기입된 항목이 있습니다. 모두 작성해주세요. 선택지 번호 및 점수는 각각 1부터 5까지 수정 가능합니다.',
        );
      }
      const IsExistOption = await this.optionsRepository.existOption(
        surveyId,
        questionId,
        number,
        content,
        score,
      );
      if (IsExistOption.IsExistNumber) {
        throw new ConflictException(
          '중복된 번호의 다른 선택지가 이미 존재합니다. 다른 번호로 작성해주세요.',
        );
      } else if (IsExistOption.IsExistContent) {
        throw new ConflictException(
          '중복된 내용의 다른 선택지가 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      } else if (IsExistOption.IsExistScore) {
        throw new ConflictException(
          '중복된 점수의 다른 선택지가 이미 존재합니다. 다른 점수로 작성해주세요.',
        );
      }
      const update = await this.optionsRepository.updateOption(
        optionId,
        number,
        content,
        score,
      );
      return update;
    } catch (error) {
      this.logger.error(
        `해당 선택지 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 선택지 삭제
  async deleteOption(surveyId: number, questionId: number, optionId: number) {
    try {
      const survey = await this.surveysRepository.getSurveyById(surveyId);
      if (!survey) {
        throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
      }
      const question =
        await this.questionsRepository.getQuestionById(questionId);
      if (!question) {
        throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
      }
      const option = await this.optionsRepository.getOptionById(optionId);
      if (!option) {
        throw new NotFoundException('해당 선택지를 찾을 수 없습니다.');
      }
      const remove = await this.optionsRepository.deleteOption(optionId);
      return remove;
    } catch (error) {
      this.logger.error(
        `해당 선택지 삭제 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }
}
