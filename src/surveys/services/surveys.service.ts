import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSurveyDto } from '../dto/create-survey.dto';
import { Repository } from 'typeorm';
import { Surveys } from '../entities/surveys.entity';
import { UpdateSurveyDto } from '../dto/update-survey.dto';
import { EntityWithId } from 'src/survey.type';

@Injectable()
export class SurveysService {
  private readonly logger = new Logger(SurveysService.name);
  constructor(private readonly surveysRepository: Repository<Surveys>) {}

  // 설문지 목록조회 (getAllSurveys)
  async getAllSurveys(): Promise<Surveys[]> {
    try {
      const surveys = await this.surveysRepository.find({
        select: ['id', 'title', 'isDone'],
      });
      if (!surveys.length) {
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

  // 단일 설문지 조회 (getSingleSurvey)
  async getSingleSurvey(surveyId: number): Promise<Surveys> {
    try {
      return await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
      });
    } catch (error) {
      this.logger.error(
        `해당 설문지 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 완료된 설문지 조회 (getDoneSurveys)
  async getDoneSurveys(): Promise<Surveys[]> {
    try {
      const surveys = await this.surveysRepository.find({
        where: {
          isDone: true,
        },
      });
      if (!surveys.length) {
        throw new NotFoundException('완료된 설문지가 아직 존재하지 않습니다.');
      }
      return surveys;
    } catch (error) {
      this.logger.error(
        `완료 설문지 목록 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 설문지 생성 (createSurvey)
  async createSurvey(createDto: CreateSurveyDto): Promise<Surveys> {
    try {
      const { title, description } = createDto;
      if (!title || !description) {
        throw new BadRequestException(
          '미기입된 항목이 있습니다. 모두 작성해주세요.',
        );
      }
      const existSurvey = await this.existSurvey(createDto);
      if (existSurvey.existTitle) {
        throw new ConflictException(
          '중복된 제목의 다른 설문지가 이미 존재합니다. 다른 제목으로 작성해주세요.',
        );
      } else if (existSurvey.existDescription) {
        throw new ConflictException(
          '중복된 내용의 다른 설문지가 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }
      return await this.surveysRepository.save(new Surveys(createDto));
    } catch (error) {
      this.logger.error(
        `해당 설문지 생성 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 설문지 수정 (updateSurvey)
  async updateSurvey(
    surveyId: number,
    updateDto: UpdateSurveyDto,
  ): Promise<Surveys> {
    try {
      const survey = await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
      });
      const update = await this.surveysRepository.save(
        new Surveys(Object.assign(survey, updateDto)),
      );
      // 중복검사
      const existTitle = await this.surveysRepository.findOne({
        where: { title: update.title },
      });
      if (existTitle) {
        throw new ConflictException(
          '중복된 제목의 다른 설문지가 이미 존재합니다. 다른 제목으로 수정해주세요.',
        );
      }
      const existDescription = await this.surveysRepository.findOne({
        where: { description: update.description },
      });
      if (existDescription) {
        throw new ConflictException(
          '중복된 내용의 다른 설문지가 이미 존재합니다. 다른 내용으로 수정해주세요.',
        );
      }
      return update;
    } catch (error) {
      this.logger.error(
        `해당 설문지 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 설문지 삭제 (deleteSurvey)
  async deleteSurvey(surveyId: number): Promise<EntityWithId> {
    try {
      const survey = await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
      });
      await this.surveysRepository.remove(survey);
      return new EntityWithId(surveyId);
    } catch (error) {
      this.logger.error(
        `해당 설문지 삭제 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 설문지 중복검사
  async existSurvey(surveyDto: CreateSurveyDto) {
    const { title, description } = surveyDto;
    const existTitle = await this.surveysRepository.findOne({
      where: { title },
    });
    const existDescription = await this.surveysRepository.findOne({
      where: { description },
    });
    return { existTitle, existDescription };
  }
}
