import { Module } from '@nestjs/common';
import { OptionsService } from './services/options.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Options } from './entities/options.entity';
import { OptionsRepository } from './repositories/options.repository';
import { OptionsResolver } from './resolvers/options.resolver';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Options])],
  // controllers: [],
  providers: [OptionsService, OptionsRepository, OptionsResolver, Repository],
})
export class OptionsModule {}
