import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';

import { SurveysRepository } from '../repositories/surveys.repository';
import { CreateSurveyDto } from '../dto/create-survey.dto';
import { UpdateSurveyDto } from '../dto/update-survey.dto';
import { DeleteSurveyDto } from '../dto/delete-survey.dto';

@Injectable()
export class SurveysService {
  constructor(private readonly surveysRepository: SurveysRepository) {}

  // 설문지 목록조회
  async getSurveys() {
    const surveys = await this.surveysRepository.getSurveys();
    if (!surveys) {
      throw new NotFoundException('설문지가 아직 존재하지 않습니다.');
    }
    return surveys;
  }

  // 설문지 상세조회
  async getSurveyById(surveyId: number) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    return survey;
  }

  // 설문지 생성
  async createSurvey(createDto: CreateSurveyDto) {
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
    const surveys = await this.surveysRepository.getSurveys();
    const IsDuplicatedTitle = surveys.some((survey) => survey.title === title);
    if (!IsDuplicatedTitle) {
      throw new ConflictException(
        '중복된 제목의 다른 설문지가 존재합니다. 다른 제목으로 작성해주세요.',
      );
    }
    const IsDuplicatedDescription = surveys.some(
      (survey) => survey.description === description,
    );
    if (!IsDuplicatedDescription) {
      throw new ConflictException(
        '중복된 내용의 다른 설문지가 존재합니다. 다른 내용으로 작성해주세요.',
      );
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
    const isPasswordValid = await bcrypt.compare(password, survey.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '권한이 없습니다. 비밀번호가 일치하지 않습니다.',
      );
    }
    const surveys = await this.surveysRepository.getSurveys();
    const IsDuplicatedTitle = surveys.some(
      (survey) => survey.title === newTitle,
    );
    if (!IsDuplicatedTitle) {
      throw new ConflictException(
        '중복된 제목의 다른 설문지가 존재합니다. 다른 제목으로 수정해주세요.',
      );
    }
    const IsDuplicatedDescription = surveys.some(
      (survey) => survey.description === newDescription,
    );
    if (!IsDuplicatedDescription) {
      throw new ConflictException(
        '중복된 내용의 다른 설문지가 존재합니다. 다른 내용으로 수정해주세요.',
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
    const isPasswordValid = await bcrypt.compare(password, survey.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '권한이 없습니다. 비밀번호가 일치하지 않습니다.',
      );
    }
    const remove = await this.surveysRepository.deleteSurvey(surveyId);
    return remove;
  }
}
