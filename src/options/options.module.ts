import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Options } from '../entities/options.entity';
import { OptionsResolver } from './options.resolver';
import { Repository } from 'typeorm';
import { Surveys } from 'src/entities/surveys.entity';
import { Questions } from 'src/entities/questions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Options, Surveys, Questions])],
  // controllers: [],
  providers: [OptionsService, OptionsResolver, Repository],
})
export class OptionsModule {}
