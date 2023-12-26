import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Options } from '../entities/options.entity';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { EntityWithId } from 'src/survey.type';
import { Surveys } from 'src/entities/surveys.entity';
import { Questions } from 'src/entities/questions.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuardJwtGql } from 'src/auth/guard/auth-guard.jwt.gql';
import { CurrentUser } from 'src/auth/common/current-user.decorator';
import { Users } from 'src/entities/user.entity';

@Resolver(() => Options)
export class OptionsResolver {
  constructor(private readonly optionsService: OptionsService) {}

  // 선택지 목록조회 (getAllOptions)
  @Query(() => [Options], {
    name: 'getAllOptions',
    description: '선택지 목록조회',
  })
  public async getAllQuestions(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('questionId', { type: () => Int }) questionId: number,
  ) {
    return await this.optionsService.getAllOptions(surveyId, questionId);
  }

  // 단일 선택지조회 (getSingleOption)
  @Query(() => Options, {
    name: 'getSingleOption',
    description: '단일 선택지조회',
  })
  public async getSingleOption(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('questionId', { type: () => Int }) questionId: number,
    @Args('optionId', { type: () => Int }) id: number,
  ) {
    return await this.optionsService.getSingleOption(surveyId, questionId, id);
  }

  // 선택지 생성 (createOption)
  @Mutation(() => Options, { name: 'createOption', description: '선택지 생성' })
  @UseGuards(AuthGuardJwtGql)
  public async createOption(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('questionId', { type: () => Int }) questionId: number,
    @Args('createDto', { type: () => CreateOptionDto })
    createDto: CreateOptionDto,
    @CurrentUser() user: Users,
  ) {
    return await this.optionsService.createOption(
      surveyId,
      questionId,
      createDto,
      user,
    );
  }

  // 선택지 수정 (updateOption) => 내용(content)만 수정 가능
  @Mutation(() => Options, { name: 'updateOption', description: '선택지 수정' })
  @UseGuards(AuthGuardJwtGql)
  public async updateOption(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('questionId', { type: () => Int }) questionId: number,
    @Args('optionId', { type: () => Int }) id: number,
    @Args('updateDto', { type: () => UpdateOptionDto })
    updateDto: UpdateOptionDto,
    @CurrentUser() user: Users,
  ) {
    return await this.optionsService.updateOption(
      surveyId,
      questionId,
      id,
      updateDto,
      user,
    );
  }

  // 선택지 삭제 (deleteOption)
  @Mutation(() => EntityWithId, {
    name: 'deleteOption',
    description: '선택지 삭제',
  })
  @UseGuards(AuthGuardJwtGql)
  public async deleteOption(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('questionId', { type: () => Int }) questionId: number,
    @Args('optionId', { type: () => Int }) id: number,
    @CurrentUser() user: Users,
  ) {
    await this.optionsService.deleteOption(surveyId, questionId, id, user);
    return new EntityWithId(id);
  }

  // relations
  // Option - survey = N : 1
  @ResolveField('survey')
  public async survey(@Parent() options: Options): Promise<Surveys> {
    return await options.survey;
  }

  // Option - question = N : 1
  @ResolveField('question')
  public async question(@Parent() options: Options): Promise<Questions> {
    return await options.question;
  }
}
