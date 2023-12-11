import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSurveyDto } from '../dto/create-survey.dto';
import { UpdateSurveyDto } from '../dto/update-survey.dto';
import { CompleteSurveyDto } from '../dto/complete-survey.dto';
import { Repository } from 'typeorm';
import { Surveys } from '../entities/surveys.entity';
import { EntityWithId } from 'src/survey.type';
import { Questions } from 'src/questions/entities/questions.entity';
import { Users } from 'src/users/entities/user.entity';

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
      return await this.surveysRepository.findOne({
        where: { id: surveyId },
        select: ['id', 'title', 'description', 'isDone', 'totalScore'],
        relations: ['questions', 'options', 'answers'],
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
  async createSurvey(
    createDto: CreateSurveyDto,
    user: Users,
  ): Promise<Surveys> {
    try {
      const { title, description } = createDto;

      const existTitle = await this.surveysRepository.findOne({
        where: { title: title },
      });
      if (existTitle) {
        throw new BadRequestException(
          '중복된 제목의 설문지가 존재합니다. 다른 제목으로 작성해주세요.',
        );
      }
      const existDescription = await this.surveysRepository.findOne({
        where: { description: description },
      });
      if (existDescription) {
        throw new BadRequestException(
          '중복된 내용의 설문지가 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }
      return await this.surveysRepository.save({
        ...createDto,
        user,
      });
      // const create = this.surveysRepository.create(createDto);
      // return await this.surveysRepository.save(create);
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
    user: Users,
  ): Promise<Surveys> {
    try {
      const survey = await this.surveysRepository.findOne({
        where: { id: surveyId },
      });

      const { title, description } = updateDto;

      const existTitle = await this.surveysRepository.findOne({
        where: { title: title },
      });
      if (existTitle) {
        throw new BadRequestException(
          '중복된 제목의 설문지가 존재합니다. 다른 제목으로 수정해주세요.',
        );
      }
      const existDescription = await this.surveysRepository.findOne({
        where: { description: description },
      });
      if (existDescription) {
        throw new BadRequestException(
          '중복된 내용의 설문지가 존재합니다. 다른 내용으로 수정해주세요.',
        );
      }
      if (survey.userId !== user.id) {
        throw new UnauthorizedException(
          null,
          '설문지를 수정할 수 있는 권한이 없습니다.',
        );
      }

      await this.surveysRepository.update(
        { id: surveyId },
        { title, description },
      );
      return await this.surveysRepository.findOne({ where: { id: surveyId } });
    } catch (error) {
      this.logger.error(
        `해당 설문지 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 설문지 삭제 (deleteSurvey)
  async deleteSurvey(surveyId: number, user: Users): Promise<EntityWithId> {
    try {
      const survey = await this.surveysRepository.findOneOrFail({
        where: { id: surveyId },
      });
      if (survey.userId !== user.id) {
        throw new UnauthorizedException(
          null,
          '설문지를 삭제할 수 있는 권한이 없습니다.',
        );
      }
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
          `설문지 완료 여부를 기입해주세요. 설문지가 완료되었을 경우, "true"를 작성해주세요.`,
        );
      }

      const allQuestions = await this.questionsRepository.find({
        where: { survey: { id: surveyId } },
      });
      if (!allQuestions.length) {
        throw new NotFoundException('해당 설문지에 문항이 존재하지 않습니다.');
      }

      const unAnsweredQuestions = allQuestions.some(
        (question) => question.isAnswered === false,
      );
      if (unAnsweredQuestions) {
        throw new BadRequestException(
          '아직 답변되지 않은 문항이 있습니다. 모두 답변해 주시고 설문지를 완료해주세요.',
        );
      }

      const allAnswered = allQuestions.every((question) => question.isAnswered);
      if (allAnswered && isDone === true) {
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
