import { OptionsService } from 'src/options/services/options.service';
import { Module } from '@nestjs/common';
import { AnswersService } from './services/answers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answers } from './entities/answers.entity';
import { OptionsRepository } from 'src/options/repositories/options.repository';
import { AnswersResolver } from './resolvers/answers.resolver';
import { Repository } from 'typeorm';
import { QuestionsService } from 'src/questions/services/questions.service';
import { Options } from 'src/options/entities/options.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answers, Options])],
  // controllers: [],
  providers: [
    AnswersService,
    OptionsRepository,
    AnswersResolver,
    OptionsService,
    QuestionsService,
    Repository,
  ],
})
export class AnswersModule {}
