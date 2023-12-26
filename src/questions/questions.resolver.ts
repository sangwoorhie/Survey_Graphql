import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { EntityWithId } from 'src/survey.type';
import { Questions } from '../entities/questions.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Options } from 'src/entities/options.entity';
import { QuestionsService } from './questions.service';
import { Surveys } from 'src/entities/surveys.entity';
import { Answers } from 'src/entities/answers.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuardJwtGql } from 'src/auth/guard/auth-guard.jwt.gql';
import { CurrentUser } from 'src/auth/common/current-user.decorator';
import { Users } from 'src/entities/user.entity';

@Resolver(() => Questions)
export class QuestionsResolver {
  constructor(private readonly questionsService: QuestionsService) {}

  // 문항 목록조회 (getAllQuestions)
  @Query(() => [Questions], {
    name: 'getAllQuestions',
    description: '문항 목록조회',
  })
  public async getAllQuestions(
    @Args('surveyId', { type: () => Int }) surveyId: number,
  ) {
    return await this.questionsService.getAllQuestions(surveyId);
  }

  // 단일 문항조회 (getSingleQuestion)
  @Query(() => Questions, {
    name: 'getSingleQuestion',
    description: '단일 문항조회',
  })
  public async getSingleQuestion(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('questionId', { type: () => Int }) id: number,
  ) {
    return await this.questionsService.getSingleQuestion(surveyId, id);
  }

  // 문항 생성 (createQuestion)
  @Mutation(() => Questions, {
    name: 'createQuestion',
    description: '문항 생성',
  })
  @UseGuards(AuthGuardJwtGql)
  public async createQuestion(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('createDto', { type: () => CreateQuestionDto })
    createDto: CreateQuestionDto,
    @CurrentUser() user: Users,
  ) {
    const question = new Questions();
    question.surveyId = surveyId;
    return await this.questionsService.createQuestion(
      surveyId,
      createDto,
      user,
    );
  }

  // 문항 수정 (updateQuestion) => 내용만 수정 가능
  @Mutation(() => Questions, {
    name: 'updateQuestion',
    description: '문항 수정',
  })
  @UseGuards(AuthGuardJwtGql)
  public async updateQuestion(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('questionId', { type: () => Int }) id: number,
    @Args('updateDto', { type: () => UpdateQuestionDto })
    updateDto: UpdateQuestionDto,
    @CurrentUser() user: Users,
  ) {
    return await this.questionsService.updateQuestion(
      surveyId,
      id,
      updateDto,
      user,
    );
  }

  // 문항 삭제 (deleteQuestion)
  @Mutation(() => EntityWithId, {
    name: 'deleteQuestion',
    description: '문항 삭제',
  })
  @UseGuards(AuthGuardJwtGql)
  public async deleteQuestion(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('questionId', { type: () => Int }) id: number,
    @CurrentUser() user: Users,
  ) {
    await this.questionsService.deleteQuestion(surveyId, id, user);
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
