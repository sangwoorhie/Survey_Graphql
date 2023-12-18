import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questions } from '../entities/questions.entity';
import { QuestionsResolver } from './questions.resolver';
import { Repository } from 'typeorm';
import { SurveysService } from 'src/surveys/surveys.service';
import { Surveys } from 'src/entities/surveys.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Questions, Surveys])],
  // controllers: [],
  providers: [QuestionsService, QuestionsResolver, Repository],
})
export class QuestionsModule {}
