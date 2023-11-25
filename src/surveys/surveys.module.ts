import { Module } from '@nestjs/common';
import { SurveysService } from './services/surveys.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Surveys } from './entities/surveys.entity';
import { SurveysResolver } from './resolvers/surveys.resolver';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Surveys])],
  // controllers: [SurveysController],
  providers: [SurveysService, SurveysResolver, Repository],
})
export class SurveysModule {}
