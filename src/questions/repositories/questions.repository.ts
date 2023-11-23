import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Questions } from '../questions.entity';
import { CreateQuestionDto } from '../dto/create-question.dto';

@Injectable()
export class QuestionsRepository extends Repository<Questions> {
  constructor(private readonly dataSource: DataSource) {
    super(Questions, dataSource.createEntityManager());
  }
  // 문항 목록조회
  async getQuestions(surveyId: number): Promise<Questions[]> {
    const questions = await this.find({
      where: { survey: { id: surveyId } },
      relations: ['survey'],
      order: { number: 'ASC' },
      select: ['id', 'number', 'content', 'isAnswered'],
    });
    console.log(questions);
    return questions;
  }

  // 문항 상세조회
  async getQuestionById(questionId: number): Promise<Questions> {
    const question = await this.findOne({
      where: { id: questionId },
      order: { createdAt: 'DESC' },
      select: [
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
  async createQuestion(createDto: CreateQuestionDto): Promise<Questions> {
    const create = this.create(createDto);
    return await this.save(create);
  }

  // 문항 수정
  async updateQuestion(
    questionId: number,
    newNumber: number,
    newContent: string,
  ): Promise<Questions> {
    await this.update(
      { id: questionId },
      { number: newNumber, content: newContent },
    );
    const update = await this.findOne({ where: { id: questionId } });
    return update;
  }

  // 문항 삭제
  async deleteQuestion(questionId: number): Promise<any> {
    const remove = await this.delete(questionId);
    return remove;
  }
}
