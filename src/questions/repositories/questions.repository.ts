import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Questions } from '../questions.entity';

@Injectable()
export class QuestionsRepository extends Repository<Questions> {
  constructor(private readonly dataSource: DataSource) {
    super(Questions, dataSource.createEntityManager());
  }
  // 문항 목록조회
  async getQuestions(surveyId: number): Promise<Questions[]> {
    const questions = await this.find({
      where: { survey: { id: surveyId } },
      order: { number: 'ASC' },
      select: ['number', 'content', 'isAnswered'],
    });
    return questions;
  }

  // 문항 상세조회
  async getQuestionById(questionId: number): Promise<Questions> {
    const question = await this.findOne({
      where: { id: questionId },
      select: [
        'surveyId',
        'id',
        'number',
        'content',
        'isAnswered',
        'createdAt',
        'updatedAt',
      ],
    });
    return question;
  }

  // 문항 생성
  async createQuestion(
    surveyId: number,
    number: number,
    content: string,
  ): Promise<Questions> {
    const create = this.create({
      surveyId,
      number,
      content,
    });
    await this.save(create);
    return create;
  }

  // 문항 중복검사
  async existQuestion(surveyId: number, number: number, content: string) {
    const IsExistNumber = await this.findOne({
      where: { surveyId, number },
    });
    const IsExistContent = await this.findOne({
      where: { surveyId, content },
    });
    return { IsExistNumber, IsExistContent };
  }

  // 문항 수정
  async updateQuestion(
    questionId: number,
    number: number,
    content: string,
  ): Promise<Questions> {
    await this.update({ id: questionId }, { number, content });
    const update = await this.findOne({ where: { id: questionId } });
    return update;
  }

  // 문항 삭제
  async deleteQuestion(questionId: number): Promise<any> {
    const remove = await this.delete(questionId);
    return remove;
  }
}
