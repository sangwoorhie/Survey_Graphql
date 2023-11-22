import { AnswersService } from '../services/answers.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateAnswerDto } from '../dto/create-answer.dto';
import { UpdateAnswerDto } from '../dto/update-answer.dto';

@Controller('surveys')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  // 답변 목록조회
  @Get('/:surveyId/questions/:questionId/answers')
  async getAnswers(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
  ) {
    const answers = await this.answersService.getAnswers(surveyId, questionId);
    return answers;
  }

  // 답변 상세조회
  @Get('/:surveyId/questions/:questionId/answers/:answerId')
  async getAnswer(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('answerId') answerId: number,
  ) {
    const answer = await this.answersService.getAnswerById(
      surveyId,
      questionId,
      answerId,
    );
    return answer;
  }

  // 답변 생성
  @Post('/:surveyId/questions/:questionId/answers')
  async createAnswer(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Body() createDto: CreateAnswerDto,
  ) {
    const create = await this.answersService.createAnswer(
      surveyId,
      questionId,
      createDto,
    );
    return create;
  }

  // 답변 수정
  @Put('/:surveyId/questions/:questionId/answers/:answerId')
  async updateAnswer(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('answerId') answerId: number,
    @Body() updateDto: UpdateAnswerDto,
  ) {
    const update = await this.answersService.updateAnswer(
      surveyId,
      questionId,
      answerId,
      updateDto,
    );
    return update;
  }

  // 답변 삭제
  @Delete('/:surveyId/questions/:questionId/answers/:answerId')
  async deleteAnswer(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('answerId') answerId: number,
  ) {
    const remove = await this.answersService.deleteAnswer(
      surveyId,
      questionId,
      answerId,
    );
    return remove;
  }
}
