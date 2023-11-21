import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Answers } from '../answers.entity';

@Injectable()
export class AnswersRepository extends Repository<Answers> {
  constructor(private readonly dataSource: DataSource) {
    super(Answers, dataSource.createEntityManager());
  }
  // 조회
  // 생성
  // 수정
  // 삭제
}
