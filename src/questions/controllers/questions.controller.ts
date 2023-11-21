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

  // 질문 목록조회
  @Get('/:surveyId/questions')
  async getQuestions(@Param('surveyId') surveyId: number) {
    return await this.questionsService.getQuestions(surveyId);
  }

  // 질문 상세조회
  @Get('/:surveyId/questions/:questionId')
  async getQuestionById(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
  ) {
    return await this.questionsService.getQuestionById(surveyId, questionId);
  }

  // 질문 생성
  @Post('/:surveyId/questions')
  async createQuestion(
    @Param('surveyId') surveyId: number,
    @Body() createDto: CreateQuestionDto,
  ) {
    return await this.questionsService.createQuestion(surveyId, createDto);
  }

  // 질문 수정
  @Put('/:surveyId/questions/:questionId')
  async updateQuestion(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Body() updateDto: UpdateQuestionDto,
  ) {
    return await this.questionsService.updateQuestion(
      surveyId,
      questionId,
      updateDto,
    );
  }

  // 질문 삭제
  @Delete('/:surveyId/questions/:questionId')
  async deleteQuestion(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Body() deleteDto: DeleteQuestionDto,
  ) {
    return await this.questionsService.deleteQuestion(
      surveyId,
      questionId,
      deleteDto,
    );
  }
}