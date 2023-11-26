import { Module } from '@nestjs/common';
import { OptionsService } from './services/options.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Options } from './entities/options.entity';
import { OptionsResolver } from './resolvers/options.resolver';
import { Repository } from 'typeorm';
import { Surveys } from 'src/surveys/entities/surveys.entity';
import { Questions } from 'src/questions/entities/questions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Options, Surveys, Questions])],
  // controllers: [],
  providers: [OptionsService, OptionsResolver, Repository],
})
export class OptionsModule {}
