import { Module } from '@nestjs/common';
import { SurveysService } from './services/surveys.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Surveys } from './entities/surveys.entity';
import { SurveysResolver } from './resolvers/surveys.resolver';
import { Repository } from 'typeorm';
import { QuestionsService } from 'src/questions/services/questions.service';
import { Questions } from 'src/questions/entities/questions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Surveys, Questions])],
  // controllers: [SurveysController],
  providers: [SurveysService, SurveysResolver, QuestionsService, Repository],
})
export class SurveysModule {}
