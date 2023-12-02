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
import { Surveys } from 'src/surveys/entities/surveys.entity';
import { Answers } from 'src/answers/entities/answers.entity';

@Resolver(() => Questions)
export class QuestionsResolver {
  constructor(private readonly questionsService: QuestionsService) {}

  // 문항 목록조회 (getAllQuestions)
  @Query(() => [Questions], { name: 'getAllQuestions' })
  public async getAllQuestions(
    @Args('surveyId', { type: () => Int }) surveyId: number,
  ) {
    return await this.questionsService.getAllQuestions(surveyId);
  }

  // 단일 문항조회 (getSingleQuestion)
  @Query(() => Questions, { name: 'getSingleQuestion' })
  public async getSingleQuestion(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('questionId', { type: () => Int }) id: number,
  ) {
    return await this.questionsService.getSingleQuestion(surveyId, id);
  }

  // 문항 생성 (createQuestion)
  @Mutation(() => Questions, { name: 'createQuestion' })
  public async createQuestion(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('createDto', { type: () => CreateQuestionDto })
    createDto: CreateQuestionDto,
  ) {
    const question = new Questions();
    question.surveyId = surveyId;
    return await this.questionsService.createQuestion(surveyId, createDto);
  }

  // 문항 수정 (updateQuestion) => 내용만 수정 가능
  @Mutation(() => Questions, { name: 'updateQuestion' })
  public async updateQuestion(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('questionId', { type: () => Int }) id: number,
    @Args('updateDto', { type: () => UpdateQuestionDto })
    updateDto: UpdateQuestionDto,
  ) {
    return await this.questionsService.updateQuestion(surveyId, id, updateDto);
  }

  // 문항 삭제 (deleteQuestion)
  @Mutation(() => EntityWithId, { name: 'deleteQuestion' })
  public async deleteQuestion(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('questionId', { type: () => Int }) id: number,
  ) {
    await this.questionsService.deleteQuestion(surveyId, id);
    return new EntityWithId(id);
  }

  // relations
  // Question - survey = N : 1
  @ResolveField('survey')
  public async survey(@Parent() questions: Questions): Promise<Surveys> {
    return await questions.survey;
  }

  // Question - options = 1 : N
  @ResolveField('options', () => [Options])
  public async options(@Parent() question: Questions): Promise<Options[]> {
    return await question.options;
  }

  // Question - answer = 1 : 1
  @ResolveField('answer')
  public async answer(@Parent() question: Questions): Promise<Answers> {
    return await question.answer;
  }
}
