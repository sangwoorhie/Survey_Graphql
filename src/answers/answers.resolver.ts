import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Answers } from '../entities/answers.entity';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { EntityWithId } from 'src/survey.type';
import { Surveys } from 'src/entities/surveys.entity';
import { Questions } from 'src/entities/questions.entity';
import { HttpCode, UseGuards } from '@nestjs/common';
import { AuthGuardJwtGql } from 'src/auth/guard/auth-guard.jwt.gql';

@Resolver(() => Answers)
export class AnswersResolver {
  constructor(private readonly answersService: AnswersService) {}

  // 답안 목록조회 (getAllAnswers)
  @Query(() => [Answers], { name: 'getAllAnswers' })
  public async getAllAnswers(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('questionId', { type: () => Int }) questionId: number,
  ) {
    return await this.answersService.getAllAnswers(surveyId, questionId);
  }

  // 단일 답안조회 (getSingleAnswer)
  @Query(() => Answers, { name: 'getSingleAnswer' })
  public async getSingleAnswer(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('questionId', { type: () => Int }) questionId: number,
    @Args('answerId', { type: () => Int }) id: number,
  ) {
    return await this.answersService.getSingleAnswer(surveyId, questionId, id);
  }

  // 답안 생성 (createAnswer)
  @Mutation(() => Answers, { name: 'createAnswer' })
  @UseGuards(AuthGuardJwtGql)
  public async createAnswer(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('questionId', { type: () => Int }) questionId: number,
    @Args('createDto', { type: () => CreateAnswerDto })
    createDto: CreateAnswerDto,
  ) {
    return await this.answersService.createAnswer(
      surveyId,
      questionId,
      createDto,
    );
  }

  // 답안 수정 (updateAnswer)
  @Mutation(() => Answers, { name: 'updateAnswer' })
  @UseGuards(AuthGuardJwtGql)
  public async updateAnswer(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('questionId', { type: () => Int }) questionId: number,
    @Args('answerId', { type: () => Int }) id: number,
    @Args('updateDto', { type: () => UpdateAnswerDto })
    updateDto: UpdateAnswerDto,
  ) {
    return await this.answersService.updateAnswer(
      surveyId,
      questionId,
      id,
      updateDto,
    );
  }

  // 답안 삭제 (deleteAnswer)
  @Mutation(() => EntityWithId, { name: 'deleteAnswer' })
  @UseGuards(AuthGuardJwtGql)
  @HttpCode(204)
  public async deleteAnswer(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('questionId', { type: () => Int }) questionId: number,
    @Args('answerId', { type: () => Int }) id: number,
  ) {
    await this.answersService.deleteAnswer(surveyId, questionId, id);
    return new EntityWithId(id);
  }

  // relations
  // Answer - Survey = N : 1
  @ResolveField('survey')
  public async survey(@Parent() answers: Answers): Promise<Surveys> {
    return await answers.survey;
  }

  // Answer - question = 1 : 1
  @ResolveField('question')
  public async question(@Parent() answer: Answers): Promise<Questions> {
    return await answer.question;
  }
}
