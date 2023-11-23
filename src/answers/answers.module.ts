import { Module } from '@nestjs/common';
import { AnswersController } from './controllers/answers.controller';
import { AnswersService } from './services/answers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answers } from './answers.entity';
import { AnswersRepository } from './repositories/answer.repository';
import { SurveysRepository } from 'src/surveys/repositories/surveys.repository';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Answers])],
  controllers: [AnswersController],
  providers: [
    AnswersService,
    AnswersRepository,
    SurveysRepository,
    QuestionsRepository,
  ],
})
export class AnswersModule {}
