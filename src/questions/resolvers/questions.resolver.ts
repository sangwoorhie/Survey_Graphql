import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { EntityWithId } from 'src/survey.type';
import { Questions } from '../entities/questions.entity';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { Options } from 'src/options/entities/options.entity';
import { QuestionsService } from './../services/questions.service';

@Resolver(() => Questions)
export class QuestionsResolver {
  private readonly logger = new Logger(QuestionsResolver.name);
  constructor(private readonly questionsService: QuestionsService) {}

  // 문항 목록조회 (getAllQuestions)
  @Query(() => [Questions], { name: 'getAllQuestions' })
  public async getAllQuestions() {
    return await this.questionsService.getAllQuestions();
  }

  // 단일 문항조회 (getSingleQuestion)
  @Query(() => Questions, { name: 'getSingleQuestion' })
  public async getSingleQuestion(
    @Args('questionId', { type: () => Int }) id: number,
  ) {
    return await this.questionsService.getSingleQuestion(id);
  }

  // 문항 생성 (createQuestion)
  @Mutation(() => Questions, { name: 'createQuestion' })
  public async createQuestion(
    @Args('createDto', { type: () => CreateQuestionDto })
    createDto: CreateQuestionDto,
  ) {
    return await this.questionsService.createQuestion(createDto);
  }

  // 문항 수정 (updateQuestion)
  @Mutation(() => Questions, { name: 'updateQuestion' })
  public async updateQuestion(
    @Args('questionId', { type: () => Int }) id: number,
    @Args('updateDto', { type: () => UpdateQuestionDto })
    updateDto: UpdateQuestionDto,
  ) {
    return await this.questionsService.updateQuestion(id, updateDto);
  }

  // 문항 삭제 (deleteQuestion)
  @Mutation(() => EntityWithId, { name: 'deleteQuestion' })
  public async deleteQuestion(
    @Args('questionId', { type: () => Int }) id: number,
  ) {
    await this.questionsService.deleteQuestion(id);
    return new EntityWithId(id);
  }

  // Question - options
  @ResolveField('options')
  public async options(@Parent() question: Questions): Promise<Options[]> {
    return await question.options;
  }
}
