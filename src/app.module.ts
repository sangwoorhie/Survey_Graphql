import { Module } from '@nestjs/common';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { OptionsModule } from './options/options.module';
import { SurveysModule } from './surveys/surveys.module';

@Module({
  imports: [QuestionsModule, AnswersModule, OptionsModule, SurveysModule],
})
export class AppModule {}
