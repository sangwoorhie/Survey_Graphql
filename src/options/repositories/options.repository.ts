import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Options } from '../options.entity';
import { CreateOptionDto } from '../dto/create-option.dto';

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
      select: ['id', 'number', 'content', 'score', 'createdAt', 'updatedAt'],
    });
    return option;
  }

  // 선택지 생성
  async createOption(createDto: CreateOptionDto): Promise<Options> {
    const create = this.create(createDto);
    return await this.save(create);
  }

  // 선택지 수정
  async updateOption(
    optionId: number,
    newNumber: number,
    newContent: string,
    newScore: number,
  ): Promise<Options> {
    await this.update(
      { id: optionId },
      { number: newNumber, content: newContent, score: newScore },
    );
    const update = await this.findOne({ where: { id: optionId } });
    return update;
  }

  // 선택지 삭제
  async deleteOption(optionId: number): Promise<any> {
    const remove = await this.delete(optionId);
    return remove;
  }
}
