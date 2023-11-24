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
import { OptionDto } from '../dto/option.dto';

@Controller('surveys')
export class OptionsController {
  constructor(private readonly OptionsService: OptionsService) {}

  // 선택지 목록조회
  @Get('/:surveyId/questions/:questionId/options')
  async getOptions(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
  ) {
    const options = await this.OptionsService.getOptions(surveyId, questionId);
    return options;
  }

  // 선택지 상세조회
  @Get('/:surveyId/questions/:questionId/options/:optionId')
  async getOptionById(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('optionId') optionId: number,
  ) {
    const option = await this.OptionsService.getOptionById(
      surveyId,
      questionId,
      optionId,
    );
    return option;
  }

  // 선택지 생성
  @Post('/:surveyId/questions/:questionId/options')
  async createOption(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Body() optionDto: OptionDto,
  ) {
    const create = await this.OptionsService.createOption(
      surveyId,
      questionId,
      optionDto,
    );
    return create;
  }

  // 선택지 수정
  @Patch('/:surveyId/questions/:questionId/options/:optionId')
  async updateOption(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('optionId') optionId: number,
    @Body() optionDto: OptionDto,
  ) {
    const update = await this.OptionsService.updateOption(
      surveyId,
      questionId,
      optionId,
      optionDto,
    );
    return update;
  }

  // 선택지 삭제
  @Delete('/:surveyId/questions/:questionId/options/:optionId')
  async deleteOption(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('optionId') optionId: number,
  ) {
    const remove = await this.OptionsService.deleteOption(
      surveyId,
      questionId,
      optionId,
    );
    return remove;
  }
}
