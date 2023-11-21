import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Options } from '../options.entity';
import { CreateOptionDto } from '../dto/create-option.dto';

@Injectable()
export class OptionsRepository extends Repository<Options> {
  constructor(private readonly dataSource: DataSource) {
    super(Options, dataSource.createEntityManager());
  }
  // 옵션 목록조회
  async getOptions() {}

  // 옵션 상세조회
  async getOptionById(optionId: number): Promise<Options> {
    const option = await this.findOne({
      where: { id: optionId },
    });
    return option;
  }

  // 옵션 생성
  async createOption(createDto: CreateOptionDto): Promise<Options> {
    const create = this.create(createDto);
    return await this.save(create);
  }

  // 옵션 수정
  async updateOption(
    optionId: number,
    newContent: string,
    newScore: number,
  ): Promise<Options> {
    await this.update(
      { id: optionId },
      { content: newContent, score: newScore },
    );
    const update = await this.findOne({ where: { id: optionId } });
    return update;
  }

  // 옵션 삭제
  async deleteOption(optionId: number): Promise<any> {
    const remove = await this.delete(optionId);
    return remove;
  }
}
