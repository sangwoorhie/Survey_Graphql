import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Options } from '../entities/options.entity';

@Injectable()
export class OptionsRepository extends Repository<Options> {
  constructor(private readonly dataSource: DataSource) {
    super(Options, dataSource.createEntityManager());
  }
  // 선택지 목록조회
  async getOptions(questionId: number): Promise<Options[]> {
    const options = await this.find({
      where: { id: questionId },
      order: { optionNumber: 'ASC' },
      select: ['optionNumber', 'content', 'optionScore'],
    });
    return options;
  }

  // 단일 선택지 조회
  async getOptionById(optionId: number): Promise<Options> {
    const option = await this.findOne({
      where: { id: optionId },
      select: ['id', 'optionNumber', 'content', 'createdAt', 'updatedAt'],
    });
    return option;
  }

  // 선택지 번호 존재유무 조회
  async IsExistNumber(questionId: number, optionNumber: number) {
    const IsExistNumber = await this.findOne({
      where: { optionNumber },
    });
    return IsExistNumber;
  }

  // 선택지 생성
  // async createOption(
  //   optionNumber: number,
  //   content: string,
  //   score: number,
  // ): Promise<Options> {
  //   const create = this.create({
  //     optionNumber,
  //     content,
  //     score,
  //   });
  //   await this.save(create);
  //   return create;
  // }

  // 선택지 중복검사
  async existOption(
    surveyId: number,
    questionId: number,
    optionNumber: number,
    content: string,
    optionScore: number,
  ) {
    const IsExistNumber = await this.findOne({
      where: { optionNumber },
    });
    const IsExistContent = await this.findOne({
      where: { content },
    });
    const IsExistScore = await this.findOne({
      where: { optionScore },
    });
    return { IsExistNumber, IsExistContent, IsExistScore };
  }

  // 선택지 수정
  async updateOption(
    optionId: number,
    optionNumber: number,
    content: string,
    optionScore: number,
  ): Promise<Options> {
    await this.update({ id: optionId }, { optionNumber, content, optionScore });
    const update = await this.findOne({ where: { id: optionId } });
    return update;
  }

  // 선택지 삭제
  async deleteOption(optionId: number): Promise<any> {
    const remove = await this.delete(optionId);
    return remove;
  }
}
