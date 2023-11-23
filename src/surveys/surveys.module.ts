import { Module } from '@nestjs/common';
import { SurveysController } from './controllers/surveys.controller';
import { SurveysService } from './services/surveys.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Surveys } from './surveys.entity';
import { SurveysRepository } from './repositories/surveys.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Surveys])],
  controllers: [SurveysController],
  providers: [SurveysService, SurveysRepository],
})
export class SurveysModule {}
