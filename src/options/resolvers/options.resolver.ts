import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Options } from '../entities/options.entity';
import { Logger } from '@nestjs/common';
import { OptionsService } from '../services/options.service';
import { CreateOptionDto } from '../dto/create-option.dto';
import { UpdateOptionDto } from '../dto/update-option.dto';
import { EntityWithId } from 'src/survey.type';

@Resolver(() => Options)
export class OptionsResolver {
  private readonly logger = new Logger(OptionsResolver.name);
  constructor(private readonly optionsService: OptionsService) {}

  // 선택지 목록조회 (getAllOptions)
  @Query(() => [Options], { name: 'getAllOptions' })
  public async getAllQuestions() {
    return await this.optionsService.getAllOptions();
  }

  // 단일 선택지조회 (getSingleOption)
  @Query(() => Options, { name: 'getSingleOption' })
  public async getSingleOption(
    @Args('optionId', { type: () => Int }) id: number,
  ) {
    return await this.optionsService.getSingleOption(id);
  }

  // 선택지 생성 (createOption)
  @Mutation(() => Options, { name: 'createOption' })
  public async createOption(
    @Args('createDto', { type: () => CreateOptionDto })
    createDto: CreateOptionDto,
  ) {
    return await this.optionsService.createOption(createDto);
  }

  // 선택지 수정 (updateOption)
  @Mutation(() => Options, { name: 'updateOption' })
  public async updateOption(
    @Args('optionId', { type: () => Int }) id: number,
    @Args('updateDto', { type: () => UpdateOptionDto })
    updateDto: UpdateOptionDto,
  ) {
    return await this.optionsService.updateOption(id, updateDto);
  }

  // 선택지 삭제 (deleteOption)
  @Mutation(() => EntityWithId, { name: 'deleteOption' })
  public async deleteOption(@Args('optionId', { type: () => Int }) id: number) {
    await this.optionsService.deleteOption(id);
    return new EntityWithId(id);
  }
}
