import { Module } from '@nestjs/common';
import { AnswersController } from './controllers/answers.controller';
import { AnswersService } from './services/answers.service';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService]
})
export class AnswersModule {}
