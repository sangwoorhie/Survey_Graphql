import { Module } from '@nestjs/common';
import { QuestionsService } from './services/questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questions } from './entities/questions.entity';
import { QuestionsResolver } from './resolvers/questions.resolver';
import { Repository } from 'typeorm';
import { SurveysService } from 'src/surveys/services/surveys.service';
import { Surveys } from 'src/surveys/entities/surveys.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Questions, Surveys])],
  // controllers: [],
  providers: [QuestionsService, QuestionsResolver, Repository],
})
export class QuestionsModule {}
