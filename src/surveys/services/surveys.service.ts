import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { SurveysRepository } from '../repositories/surveys.repository';
import { CreateSurveyDto } from '../dto/create-survey.dto';
import { UpdateSurveyDto } from '../dto/update-survey.dto';
import { DeleteSurveyDto } from '../dto/delete-survey.dto';

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
  async createSurvey(createDto: CreateSurveyDto) {
    try {
      const { title, description, password } = createDto;
      if (!title || !description) {
        throw new BadRequestException(
          '미기입된 항목이 있습니다. 모두 작성해주세요.',
        );
      } else if (!password) {
        throw new BadRequestException(
          '비밀번호를 생성해주세요. 비밀번호는 해당 설문지 및 문항, 옵션의 수정 및 삭제 시에 사용됩니다.',
        );
      }
      const IsExistTitle = await this.surveysRepository.findOne({
        where: { title },
      });
      if (IsExistTitle) {
        throw new ConflictException(
          '중복된 제목의 다른 설문지가 이미 존재합니다. 다른 제목으로 작성해주세요.',
        );
      }
      const IsExistDescription = await this.surveysRepository.findOne({
        where: { description },
      });
      if (IsExistDescription) {
        throw new ConflictException(
          '중복된 내용의 다른 설문지가 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }
      const create = await this.surveysRepository.createSurvey(createDto);
      return create;
    } catch (error) {
      this.logger.error(
        `해당 설문지 생성 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 설문지 수정
  async updateSurvey(updateDto: UpdateSurveyDto, surveyId: number) {
    try {
      const survey = await this.surveysRepository.getSurveyById(surveyId);
      if (!survey) {
        throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
      }
      const { newTitle, newDescription, password } = updateDto;
      if (!newTitle || !newDescription) {
        throw new BadRequestException(
          '미기입된 항목이 있습니다. 모두 작성해주세요.',
        );
      } else if (!password) {
        throw new BadRequestException('비밀번호를 입력해주세요.');
      }
      const pw = await this.surveysRepository.findOne({
        where: { password },
      });
      const isPasswordValid = await bcrypt.compare(password, pw.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          '권한이 없습니다. 비밀번호가 일치하지 않습니다.',
        );
      }
      const IsExistTitle = await this.surveysRepository.findOne({
        where: { title: newTitle },
      });
      if (IsExistTitle) {
        throw new ConflictException(
          '중복된 제목의 다른 설문지가 이미 존재합니다. 다른 제목으로 수정해주세요.',
        );
      }
      const IsExistDescription = await this.surveysRepository.findOne({
        where: { description: newDescription },
      });
      if (IsExistDescription) {
        throw new ConflictException(
          '중복된 내용의 다른 설문지가 이미 존재합니다. 다른 내용으로 수정해주세요.',
        );
      }
      const update = await this.surveysRepository.updateSurvey(
        surveyId,
        newTitle,
        newDescription,
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
  async deleteSurvey(deleteDto: DeleteSurveyDto, surveyId: number) {
    try {
      const survey = await this.surveysRepository.getSurveyById(surveyId);
      if (!survey) {
        throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
      }
      const { password } = deleteDto;
      if (!password) {
        throw new BadRequestException('비밀번호를 입력해주세요.');
      }
      const pw = await this.surveysRepository.findOne({
        where: { password },
      });
      const isPasswordValid = await bcrypt.compare(password, pw.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          '권한이 없습니다. 비밀번호가 일치하지 않습니다.',
        );
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
