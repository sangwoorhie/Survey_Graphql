import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Surveys } from '../entities/surveys.entity';
import { SurveysResolver } from './surveys.resolver';
import { Repository } from 'typeorm';
import { QuestionsService } from 'src/questions/questions.service';
import { Questions } from 'src/entities/questions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Surveys, Questions])],
  // controllers: [SurveysController],
  providers: [SurveysService, SurveysResolver, QuestionsService, Repository],
})
export class SurveysModule {}
