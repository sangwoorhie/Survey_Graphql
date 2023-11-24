import { QuestionsService } from '../services/questions.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { QuestionDto } from '../dto/question.dto';

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
    @Body() questionDto: QuestionDto,
  ) {
    const create = await this.questionsService.createQuestion(
      surveyId,
      questionDto,
    );
    return create;
  }

  // 문항 수정
  @Patch('/:surveyId/questions/:questionId')
  async updateQuestion(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Body() questionDto: QuestionDto,
  ) {
    const update = await this.questionsService.updateQuestion(
      surveyId,
      questionId,
      questionDto,
    );
    return update;
  }

  // 문항 삭제
  @Delete('/:surveyId/questions/:questionId')
  async deleteQuestion(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
  ) {
    const remove = await this.questionsService.deleteQuestion(
      surveyId,
      questionId,
    );
    return remove;
  }
}
