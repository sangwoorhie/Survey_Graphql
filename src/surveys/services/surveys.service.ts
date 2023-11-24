import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { SurveysRepository } from '../repositories/surveys.repository';
import { SurveyDto } from '../dto/create-survey.dto';

@Injectable()
export class SurveysService {
  private readonly logger = new Logger(SurveysService.name);
  constructor(private readonly surveysRepository: SurveysRepository) {}

  // 설문지 목록조회
  async getSurveys() {
    try {
      const surveys = await this.surveysRepository.getSurveys();
      if (!surveys) {
        throw new NotFoundException('설문지가 아직 존재하지 않습니다.');
      }
      return surveys;
    } catch (error) {
      this.logger.error(
        `설문지 목록 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 설문지 상세조회
  async getSurveyById(surveyId: number) {
    try {
      const survey = await this.surveysRepository.getSurveyById(surveyId);
      if (!survey) {
        throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
      }
      return survey;
    } catch (error) {
      this.logger.error(
        `해당 설문지 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 설문지 생성
  async createSurvey(surveyDto: SurveyDto) {
    try {
      const { title, description } = surveyDto;
      if (!title || !description) {
        throw new BadRequestException(
          '미기입된 항목이 있습니다. 모두 작성해주세요.',
        );
      }
      const IsExistSurvey = await this.surveysRepository.existSurvey(surveyDto);
      if (IsExistSurvey.existTitle) {
        throw new ConflictException(
          '중복된 제목의 다른 설문지가 이미 존재합니다. 다른 제목으로 작성해주세요.',
        );
      } else if (IsExistSurvey.existDescription) {
        throw new ConflictException(
          '중복된 내용의 다른 설문지가 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }
      const create = await this.surveysRepository.createSurvey(surveyDto);
      return create;
    } catch (error) {
      this.logger.error(
        `해당 설문지 생성 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 설문지 수정
  async updateSurvey(surveyDto: SurveyDto, surveyId: number) {
    try {
      const survey = await this.surveysRepository.getSurveyById(surveyId);
      if (!survey) {
        throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
      }
      const { title, description } = surveyDto;
      if (!title || !description) {
        throw new BadRequestException(
          '미기입된 항목이 있습니다. 모두 작성해주세요.',
        );
      }
      const IsExistSurvey = await this.surveysRepository.existSurvey(surveyDto);
      if (IsExistSurvey.existTitle) {
        throw new ConflictException(
          '중복된 제목의 다른 설문지가 이미 존재합니다. 다른 제목으로 수정해주세요.',
        );
      } else if (IsExistSurvey.existDescription) {
        throw new ConflictException(
          '중복된 내용의 다른 설문지가 이미 존재합니다. 다른 내용으로 수정해주세요.',
        );
      }
      const update = await this.surveysRepository.updateSurvey(
        surveyId,
        title,
        description,
      );
      return update;
    } catch (error) {
      this.logger.error(
        `해당 설문지 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 설문지 삭제
  async deleteSurvey(surveyId: number) {
    try {
      const survey = await this.surveysRepository.getSurveyById(surveyId);
      if (!survey) {
        throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
      }
      const remove = await this.surveysRepository.deleteSurvey(surveyId);
      return remove;
    } catch (error) {
      this.logger.error(
        `해당 설문지 삭제 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }
}
