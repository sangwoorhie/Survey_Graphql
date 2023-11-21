import { OptionsService } from './../services/options.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateOptionDto } from '../dto/create-option.dto';
import { UpdateOptionDto } from '../dto/update-option.dto';
import { DeleteOptionDto } from '../dto/delete-option.dto';

@Controller('surveys')
export class OptionsController {
  constructor(private readonly OptionsService: OptionsService) {}

  // 옵션 목록조회
  @Get('/:surveyId/questions/:questionId/options')
  async getOptions(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
  ) {
    return await this.OptionsService.getOptions(surveyId, questionId);
  }

  // 옵션 상세조회
  @Get('/:surveyId/questions/:questionId/options/:optionId')
  async getOptionById(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('optionId') optionId: number,
  ) {
    return await this.OptionsService.getOptionById(
      surveyId,
      questionId,
      optionId,
    );
  }

  // 옵션 생성
  @Post('/:surveyId/questions/:questionId/options')
  async createOption(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Body() createDto: CreateOptionDto,
  ) {
    return await this.OptionsService.createOption(
      surveyId,
      questionId,
      createDto,
    );
  }

  // 옵션 수정
  @Patch('/:surveyId/questions/:questionId/options/:optionId')
  async updateOption(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('optionId') optionId: number,
    @Body() updateDto: UpdateOptionDto,
  ) {
    return await this.OptionsService.updateOption(
      surveyId,
      questionId,
      optionId,
      updateDto,
    );
  }

  // 옵션 삭제
  @Delete('/:surveyId/questions/:questionId/options/:optionId')
  async deleteOption(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('optionId') optionId: number,
    @Body() deleteDto: DeleteOptionDto,
  ) {
    return await this.OptionsService.deleteOption(
      surveyId,
      questionId,
      optionId,
      deleteDto,
    );
  }
}
