import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Answers } from '../entities/answers.entity';
import { Logger } from '@nestjs/common';
import { AnswersService } from '../services/answers.service';
import { CreateAnswerDto } from '../dto/create-answer.dto';
import { UpdateAnswerDto } from '../dto/update-answer.dto';
import { EntityWithId } from 'src/survey.type';

@Resolver(() => Answers)
export class AnswersResolver {
  private readonly logger = new Logger(AnswersResolver.name);
  constructor(private readonly answersService: AnswersService) {}

  // 답안 목록조회 (getAllAnswers)
  @Query(() => [Answers], { name: 'getAllAnswers' })
  public async getAllAnswers() {
    return await this.answersService.getAllAnswers();
  }

  // 단일 답안조회 (getSingleAnswer)
  @Query(() => Answers, { name: 'getSingleAnswer' })
  public async getSingleAnswer(
    @Args('answerId', { type: () => Int }) id: number,
  ) {
    return await this.answersService.getSingleAnswer(id);
  }

  // 답안 생성 (createAnswer)
  @Mutation(() => Answers, { name: 'createAnswer' })
  public async createAnswer(
    @Args('createAnswer', { type: () => CreateAnswerDto })
    createDto: CreateAnswerDto,
  ) {
    return await this.answersService.createAnswer(createDto);
  }

  // 답안 수정 (updateAnswer)
  @Mutation(() => Answers, { name: 'updateAnswer' })
  public async updateAnswer(
    @Args('optionId', { type: () => Int }) id: number,
    @Args('updateDto', { type: () => UpdateAnswerDto })
    updateDto: UpdateAnswerDto,
  ) {
    return await this.answersService.updateAnswer(id, updateDto);
  }

  // 답안 삭제 (deleteAnswer)
  @Mutation(() => EntityWithId, { name: 'deleteAnswer' })
  public async deleteAnswer(@Args('answerId', { type: () => Int }) id: number) {
    await this.answersService.deleteAnswer(id);
    return new EntityWithId(id);
  }
}
