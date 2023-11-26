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
import { CreateSurveyDto } from '../dto/create-survey.dto';
import { UpdateSurveyDto } from '../dto/update-survey.dto';
import { CompleteSurveyDto } from '../dto/complete-survey.dto';
import { Surveys } from '../entities/surveys.entity';
import { EntityWithId } from 'src/survey.type';
import { Questions } from 'src/questions/entities/questions.entity';
import { Options } from 'src/options/entities/options.entity';
import { Answers } from 'src/answers/entities/answers.entity';
import { SurveysService } from '../services/surveys.service';

@Resolver(() => Surveys)
export class SurveysResolver {
  constructor(private readonly surveysService: SurveysService) {}

  // 설문지 목록조회 (getAllSurveys)
  @Query(() => [Surveys], { name: 'getAllSurveys' })
  public async getAllSurveys() {
    return await this.surveysService.getAllSurveys();
  }

  // 단일 설문지 조회 (getSingleSurvey)
  @Query(() => Surveys, { name: 'getSingleSurvey' })
  public async getSingleSurvey(
    @Args('surveyId', { type: () => Int }) id: number,
  ) {
    return await this.surveysService.getSingleSurvey(id);
  }

  // 완료된 설문지목록 조회 (getDoneSurveys)
  @Query(() => [Surveys], { name: 'getDoneSurveys' })
  public async getDoneSurveys() {
    return await this.surveysService.getDoneSurveys();
  }

  // 설문지 생성 (createSurvey)
  @Mutation(() => Surveys, { name: 'createSurvey' })
  public async createSurvey(
    @Args('createDto', { type: () => CreateSurveyDto })
    createDto: CreateSurveyDto,
  ) {
    return await this.surveysService.createSurvey(createDto);
  }

  // 설문지 수정 (updateSurvey)
  @Mutation(() => Surveys, { name: 'updateSurvey' })
  public async updateSurvey(
    @Args('surveyId', { type: () => Int }) id: number,
    @Args('updateDto', { type: () => UpdateSurveyDto })
    updateDto: UpdateSurveyDto,
  ) {
    return await this.surveysService.updateSurvey(id, updateDto);
  }

  // 설문지 삭제 (deleteSurvey)
  @Mutation(() => EntityWithId, { name: 'deleteSurvey' })
  public async deleteSurvey(@Args('surveyId', { type: () => Int }) id: number) {
    await this.surveysService.deleteSurvey(id);
    return new EntityWithId(id);
  }

  // 설문지 완료 (completeSurvey)
  @Mutation(() => Surveys, { name: 'completeSurvey' })
  public async completeSurvey(
    @Args('surveyId', { type: () => Int }) id: number,
    @Args('completeDto', { type: () => CompleteSurveyDto })
    completeDto: CompleteSurveyDto,
  ) {
    return await this.surveysService.completeSurvey(id, completeDto);
  }

  // relations
  // Survey - questions = 1 : N
  @ResolveField('questions', () => [Questions])
  public async questions(@Parent() survey: Surveys): Promise<Questions[]> {
    return await survey.questions;
  }

  // Survey - options = 1 : M
  @ResolveField('options', () => [Options])
  public async options(@Parent() survey: Surveys): Promise<Options[]> {
    return await survey.options;
  }

  // Survey - answers = 1 : N
  @ResolveField('answers', () => [Answers])
  public async answers(@Parent() survey: Surveys): Promise<Answers[]> {
    return await survey.answers;
  }
}
