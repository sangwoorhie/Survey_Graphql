import { OptionsService } from 'src/options/services/options.service';
import { Module } from '@nestjs/common';
import { AnswersService } from './services/answers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answers } from './entities/answers.entity';
import { AnswersResolver } from './resolvers/answers.resolver';
import { Repository } from 'typeorm';
import { QuestionsService } from 'src/questions/services/questions.service';
import { Options } from 'src/options/entities/options.entity';
import { SurveysService } from 'src/surveys/services/surveys.service';
import { Surveys } from 'src/surveys/entities/surveys.entity';
import { Questions } from 'src/questions/entities/questions.entity';

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
