import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Questions } from '../questions.entity';

@Injectable()
export class QuestionsRepository extends Repository<Questions> {
  constructor(private readonly dataSource: DataSource) {
    super(Questions, dataSource.createEntityManager());
  }
  // 질문 목록조회
  async getQuestions(surveyId: number) {}

  // 질문 상세조회
  async getQuestionById(questionId: number): Promise<Questions> {
    const question = await this.findOne({
      where: { id: questionId },
    });
    return question;
  }

  // 질문 생성
  async createQuestion(content: string): Promise<Questions> {
    const create = this.create({ content });
    return await this.save(create);
  }

  // 질문 수정
  async updateQuestion(
    questionId: number,
    newContent: string,
  ): Promise<Questions> {
    await this.update({ id: questionId }, { content: newContent });
    const update = await this.findOne({ where: { id: questionId } });
    return update;
  }

  // 질문 삭제
  async deleteQuestion(questionId: number): Promise<any> {
    const remove = await this.delete(questionId);
    return remove;
  }
}
