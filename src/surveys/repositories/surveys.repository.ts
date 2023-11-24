import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Surveys } from '../surveys.entity';
import { SurveyDto } from '../dto/create-survey.dto';

@Injectable()
export class SurveysRepository extends Repository<Surveys> {
  constructor(private readonly dataSource: DataSource) {
    super(Surveys, dataSource.createEntityManager());
  }
  // 설문지 목록조회
  async getSurveys(): Promise<
    {
      id: number;
      title: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
    }[]
  > {
    const surveys = await this.find({
      order: { createdAt: 'DESC' },
      select: ['id', 'title', 'createdAt', 'updatedAt'],
    });

    return surveys;
  }

  // 설문지 상세조회
  async getSurveyById(surveyId: number): Promise<Surveys> {
    const survey = await this.createQueryBuilder('survey')
      .leftJoinAndSelect('survey.question', 'question')
      .select([
        'survey.id',
        'survey.title',
        'survey.description',
        'survey.createdAt',
        'survey.updatedAt',
        'question.number',
        'question.content',
      ])
      .where('survey.id = :id', { id: surveyId })
      .getOne();

    return survey;
  }

  // 설문지 생성
  async createSurvey(surveyDto: SurveyDto): Promise<Surveys> {
    const { title, description } = surveyDto;
    const create = this.create({
      title,
      description,
    });
    return await this.save(create);
  }

  // 설문지 중복검사
  async existSurvey(surveyDto: SurveyDto) {
    const { title, description } = surveyDto;
    const existTitle = await this.findOne({ where: { title } });
    const existDescription = await this.findOne({ where: { description } });
    return { existTitle, existDescription };
  }

  // 설문지 수정
  async updateSurvey(
    surveyId: number,
    title: string,
    description: string,
  ): Promise<Surveys> {
    await this.update({ id: surveyId }, { title, description });
    const update = await this.findOne({ where: { id: surveyId } });
    return update;
  }

  // 설문지 삭제
  async deleteSurvey(surveyId: number): Promise<any> {
    const remove = await this.delete(surveyId);
    return remove;
  }
}
