import { Module } from '@nestjs/common';
import { QuestionsController } from './controllers/questions.controller';
import { QuestionsService } from './services/questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questions } from './questions.entity';
import { QuestionsRepository } from './repositories/questions.repository';
import { SurveysRepository } from 'src/surveys/repositories/surveys.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Questions])],
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionsRepository, SurveysRepository],
})
export class QuestionsModule {}
