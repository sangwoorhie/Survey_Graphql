import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSurveyDto } from '../dto/create-survey.dto';
import { UpdateSurveyDto } from '../dto/update-survey.dto';
import { CompleteSurveyDto } from '../dto/complete-survey.dto';
import { Repository } from 'typeorm';
import { Surveys } from '../entities/surveys.entity';
import { EntityWithId } from 'src/survey.type';
import { Questions } from 'src/questions/entities/questions.entity';

@Injectable()
export class SurveysService {
  private readonly logger = new Logger(SurveysService.name);
  constructor(
    @InjectRepository(Surveys)
    private readonly surveysRepository: Repository<Surveys>,
    @InjectRepository(Questions)
    private readonly questionsRepository: Repository<Questions>,
  ) {}

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
      const survey = await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
        relations: ['questions'],
      });

      const allQuestions = await this.questionsRepository;
    } catch (error) {
      return;
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

  // 설문지 완료 (completeSurvey)
  async completeSurvey(
    surveyId: number,
    completeDto: CompleteSurveyDto,
  ): Promise<Surveys> {
    try {
      const survey = await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
      });
      if (survey.isDone === true) {
        throw new BadRequestException('이미 완료된 설문지입니다.');
      }
      const { isDone } = completeDto;
      if (isDone === false || isDone !== true) {
        throw new BadRequestException(
          '설문지 완료 여부를 기입해주세요. 설문지가 완료되었을 경우, `true`를 작성해주세요.',
        );
      }

      // survey의 모든 question들이 isAnswered === true인지 확인, 아닐시 if문처리 필요
      if (isDone === true) {
        await this.surveysRepository.update({ id: surveyId }, { isDone: true });
      }
      return await this.surveysRepository.findOne({ where: { id: surveyId } });
    } catch (error) {
      this.logger.error(
        `해당 설문지 완료 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }
}
