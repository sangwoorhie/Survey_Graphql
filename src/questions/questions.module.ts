import { Module } from '@nestjs/common';
import { QuestionsService } from './services/questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questions } from './entities/questions.entity';
import { QuestionsResolver } from './resolvers/questions.resolver';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Questions])],
  // controllers: [],
  providers: [QuestionsService, QuestionsResolver, Repository],
})
export class QuestionsModule {}
