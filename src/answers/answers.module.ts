import { OptionsService } from 'src/options/options.service';
import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answers } from '../entities/answers.entity';
import { AnswersResolver } from './answers.resolver';
import { Repository } from 'typeorm';
import { QuestionsService } from 'src/questions/questions.service';
import { Options } from 'src/entities/options.entity';
import { SurveysService } from 'src/surveys/surveys.service';
import { Surveys } from 'src/entities/surveys.entity';
import { Questions } from 'src/entities/questions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answers, Options, Surveys, Questions])],
  // controllers: [],
  providers: [
    AnswersService,
    AnswersResolver,
    OptionsService,
    QuestionsService,
    SurveysService,
    Repository,
  ],
})
export class AnswersModule {}
