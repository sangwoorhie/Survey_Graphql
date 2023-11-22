import { QuestionsService } from '../services/questions.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { DeleteQuestionDto } from '../dto/delete-question.dto';

@Controller('surveys')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // 문항 목록조회
  @Get('/:surveyId/questions')
  async getQuestions(@Param('surveyId') surveyId: number) {
    const questions = await this.questionsService.getQuestions(surveyId);
    return questions;
  }

  // 문항 상세조회
  @Get('/:surveyId/questions/:questionId')
  async getQuestionById(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
  ) {
    const question = await this.questionsService.getQuestionById(
      surveyId,
      questionId,
    );
    return question;
  }

  // 문항 생성
  @Post('/:surveyId/questions')
  async createQuestion(
    @Param('surveyId') surveyId: number,
    @Body() createDto: CreateQuestionDto,
  ) {
    const create = await this.questionsService.createQuestion(
      surveyId,
      createDto,
    );
    return create;
  }

  // 문항 수정
  @Put('/:surveyId/questions/:questionId')
  async updateQuestion(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Body() updateDto: UpdateQuestionDto,
  ) {
    const update = await this.questionsService.updateQuestion(
      surveyId,
      questionId,
      updateDto,
    );
    return update;
  }

  // 문항 삭제
  @Delete('/:surveyId/questions/:questionId')
  async deleteQuestion(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Body() deleteDto: DeleteQuestionDto,
  ) {
    const remove = await this.questionsService.deleteQuestion(
      surveyId,
      questionId,
      deleteDto,
    );
    return remove;
  }
}
