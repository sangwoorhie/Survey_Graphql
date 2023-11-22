import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Answers } from '../answers.entity';
import { CreateAnswerDto } from '../dto/create-answer.dto';

@Injectable()
export class AnswersRepository extends Repository<Answers> {
  constructor(private readonly dataSource: DataSource) {
    super(Answers, dataSource.createEntityManager());
  }

  // 답변 목록조회
  async getAnswers(questionId: number): Promise<Answers[]> {
    const option = await this.find({
      where: { id: questionId },
      select: ['number'],
    });
    return option;
  }

  // 답변 상세조회
  async getAnswerById(answerId: number): Promise<Answers> {
    const answer = await this.findOne({
      where: { id: answerId },
    });
    return answer;
  }

  // 답변 생성
  async createAnswer(createDto: CreateAnswerDto): Promise<Answers> {
    const create = this.create(createDto);
    return await this.save(create);
  }

  // 답변 수정
  async updateAnswer(answerId: number, newNumber: number): Promise<Answers> {
    await this.update({ id: answerId }, { number: newNumber });
    const update = await this.findOne({ where: { id: answerId } });
    return update;
  }

  // 답변 삭제
  async deleteAnswer(answerId: number): Promise<any> {
    const remove = await this.delete(answerId);
    return remove;
  }
}
