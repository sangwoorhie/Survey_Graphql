import { AnswersService } from '../services/answers.service';
import { Controller } from '@nestjs/common';

@Controller('surveys')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  // 생성
  // 조회
  // 수정
  // 삭제
}
