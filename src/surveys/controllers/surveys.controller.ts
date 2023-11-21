import { CreateSurveyDto } from '../dto/create-survey.dto';
import { UpdateSurveyDto } from '../dto/update-survey.dto';
import { DeleteSurveyDto } from '../dto/delete-survey.dto';
import { SurveysService } from '../services/surveys.service';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  // 설문지 목록조회
  @Get()
  async getSurveys() {
    return await this.surveysService.getSurveys();
  }

  // 설문지 상세조회
  @Get('/:surveyId')
  async getSurveyById(@Param('surveyId') surveyId: number) {
    return await this.surveysService.getSurveyById(surveyId);
  }

  // 설문지 생성
  @Post()
  async createSurvey(@Body() createDto: CreateSurveyDto) {
    return await this.surveysService.createSurvey(createDto);
  }

  // 설문지 수정
  @Patch('/:surveyId')
  async updateSurvey(
    @Param('surveyId') surveyId: number,
    @Body() updateDto: UpdateSurveyDto,
  ) {
    return await this.surveysService.updateSurvey(updateDto, surveyId);
  }

  // 설문지 삭제
  @Delete('/:surveyId')
  async deleteSurvey(
    @Param('surveyId') surveyId: number,
    @Body() deleteDto: DeleteSurveyDto,
  ) {
    await this.surveysService.deleteSurvey(deleteDto, surveyId);
  }
}