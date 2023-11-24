import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Options } from '../options.entity';
import { OptionDto } from '../dto/option.dto';

@Injectable()
export class OptionsRepository extends Repository<Options> {
  constructor(private readonly dataSource: DataSource) {
    super(Options, dataSource.createEntityManager());
  }
  // 선택지 목록조회
  async getOptions(questionId: number): Promise<Options[]> {
    const options = await this.find({
      where: { id: questionId },
      order: { number: 'ASC' },
      select: ['number', 'content', 'score'],
    });
    return options;
  }

  // 선택지 상세조회
  async getOptionById(optionId: number): Promise<Options> {
    const option = await this.findOne({
      where: { id: optionId },
      select: [
        'surveyId',
        'questionId',
        'id',
        'number',
        'content',
        'score',
        'createdAt',
        'updatedAt',
      ],
    });
    return option;
  }

  // 선택지 생성
  async createOption(
    surveyId: number,
    questionId: number,
    number: number,
    content: string,
    score: number,
  ): Promise<Options> {
    const create = this.create({
      surveyId,
      questionId,
      number,
      content,
      score,
    });
    await this.save(create);
    return create;
  }

  // 선택지 중복검사
  async existOption(
    surveyId: number,
    questionId: number,
    number: number,
    content: string,
    score: number,
  ) {
    const IsExistNumber = await this.findOne({
      where: { surveyId, questionId, number },
    });
    const IsExistContent = await this.findOne({
      where: { surveyId, questionId, content },
    });
    const IsExistScore = await this.findOne({
      where: { surveyId, questionId, score },
    });
    return { IsExistNumber, IsExistContent, IsExistScore };
  }

  // 선택지 수정
  async updateOption(
    optionId: number,
    number: number,
    content: string,
    score: number,
  ): Promise<Options> {
    await this.update({ id: optionId }, { number, content, score });
    const update = await this.findOne({ where: { id: optionId } });
    return update;
  }

  // 선택지 삭제
  async deleteOption(optionId: number): Promise<any> {
    const remove = await this.delete(optionId);
    return remove;
  }
}
