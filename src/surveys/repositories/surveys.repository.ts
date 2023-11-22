import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Surveys } from '../surveys.entity';
import { CreateSurveyDto } from '../dto/create-survey.dto';

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
    const result = await this.find({
      order: { createdAt: 'DESC' },
      select: ['id', 'title', 'createdAt', 'updatedAt'],
    });

    const surveys = result.map((survey) => {
      return {
        id: survey.id,
        title: survey.title,
        description: survey.description,
        createdAt: survey.createdAt,
        updatedAt: survey.updatedAt,
      };
    });

    return surveys;
  }

  // 설문지 상세조회
  async getSurveyById(surveyId: number): Promise<Surveys> {
    const survey = await this.findOne({
      where: { id: surveyId },
      order: { createdAt: 'DESC' },
      select: [
        'id',
        'title',
        'description',
        'isAnswered',
        'createdAt',
        'updatedAt',
      ],
    });
    return survey;
  }

  // 설문지 생성
  async createSurvey(createDto: CreateSurveyDto): Promise<Surveys> {
    const create = this.create(createDto);
    return await this.save(create);
  }

  // 설문지 수정
  async updateSurvey(
    surveyId: number,
    newTitle: string,
    newDescription: string,
  ): Promise<Surveys> {
    await this.update(
      { id: surveyId },
      { title: newTitle, description: newDescription },
    );
    const update = await this.findOne({ where: { id: surveyId } });
    return update;
  }

  // 설문지 삭제
  async deleteSurvey(surveyId: number): Promise<any> {
    const remove = await this.delete(surveyId);
    return remove;
  }
}
