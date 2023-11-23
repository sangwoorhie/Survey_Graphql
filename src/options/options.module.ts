import { Module } from '@nestjs/common';
import { OptionsController } from './controllers/options.controller';
import { OptionsService } from './services/options.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Options } from './options.entity';
import { OptionsRepository } from './repositories/options.repository';
import { SurveysRepository } from 'src/surveys/repositories/surveys.repository';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Options])],
  controllers: [OptionsController],
  providers: [
    OptionsService,
    OptionsRepository,
    SurveysRepository,
    QuestionsRepository,
  ],
})
export class OptionsModule {}
