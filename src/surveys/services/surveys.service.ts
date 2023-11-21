import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { SurveysRepository } from '../repositories/surveys.repository';
import { CreateSurveyDto } from '../dto/create-survey.dto';
import { UpdateSurveyDto } from '../dto/update-survey.dto';
import { DeleteSurveyDto } from '../dto/delete-survey.dto';

@Injectable()
export class SurveysService {
  constructor(private readonly surveysRepository: SurveysRepository) {}

  // 설문지 목록조회
  async getSurveys() {
    return await this.surveysRepository.getSurveys();
  }

  // 설문지 상세조회
  async getSurveyById(surveyId: number) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const surveyObject = {
      id: survey.id,
      title: survey.title,
      description: survey.description,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt,
    };
    return surveyObject;
  }

  // 설문지 생성
  async createSurvey(createDto: CreateSurveyDto) {
    const { title, description, password } = createDto;
    if (!title || !description) {
      throw new BadRequestException(
        '미기입된 항목이 있습니다. 모두 작성해주세요.',
      );
    } else if (!password) {
      throw new BadRequestException('비밀번호를 입력해주세요.');
    }
    const create = await this.surveysRepository.createSurvey(createDto);
    return create;
  }

  // 설문지 수정
  async updateSurvey(updateDto: UpdateSurveyDto, surveyId: number) {
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

    if (survey.password !== password) {
      throw new UnauthorizedException(
        '권한이 없습니다. 비밀번호가 일치하지 않습니다.',
      );
    }
    const update = await this.surveysRepository.updateSurvey(
      surveyId,
      newTitle,
      newDescription,
    );

    return update;
  }

  // 설문지 삭제
  async deleteSurvey(deleteDto: DeleteSurveyDto, surveyId: number) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const { password } = deleteDto;
    if (!password) {
      throw new BadRequestException('비밀번호를 입력해주세요.');
    }
    if (survey.password !== password) {
      throw new UnauthorizedException(
        '권한이 없습니다. 비밀번호가 일치하지 않습니다.',
      );
    }
    const remove = await this.surveysRepository.deleteSurvey(surveyId);
    return remove;
  }
}
