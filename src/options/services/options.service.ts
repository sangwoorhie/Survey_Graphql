import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OptionsRepository } from '../repositories/options.repository';
import { SurveysRepository } from 'src/surveys/repositories/surveys.repository';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';
import { CreateOptionDto } from '../dto/create-option.dto';
import { UpdateOptionDto } from '../dto/update-option.dto';
import { DeleteOptionDto } from '../dto/delete-option.dto';

@Injectable()
export class OptionsService {
  constructor(
    private readonly optionsRepository: OptionsRepository,
    private readonly surveysRepository: SurveysRepository,
    private readonly questionsRepository: QuestionsRepository,
  ) {}

  // 옵션 목록조회
  async getOptions(surveyId: number, questionId: number) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const question = await this.questionsRepository.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('해당 질문을 찾을 수 없습니다.');
    }
  }

  // 옵션 상세조회
  async getOptionById(surveyId: number, questionId: number, optionId: number) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const question = await this.questionsRepository.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('해당 질문을 찾을 수 없습니다.');
    }
    const option = await this.optionsRepository.getOptionById(optionId);
    if (!option) {
      throw new NotFoundException('해당 선택지를 찾을 수 없습니다.');
    }
    return option;
  }

  // 옵션 생성
  async createOption(
    surveyId: number,
    questionId: number,
    createDto: CreateOptionDto,
  ) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const question = await this.questionsRepository.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('해당 질문을 찾을 수 없습니다.');
    }
    const { content, score } = createDto;
    if (!content || !score) {
      throw new BadRequestException(
        '미기입된 항목이 있습니다. 모두 작성해주세요.',
      );
    }
    const option = await this.optionsRepository.createOption(createDto);
    return option;
  }

  // 옵션 수정
  async updateOption(
    surveyId: number,
    questionId: number,
    optionId: number,
    updateDto: UpdateOptionDto,
  ) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const question = await this.questionsRepository.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('해당 질문을 찾을 수 없습니다.');
    }
    const option = await this.optionsRepository.getOptionById(optionId);
    if (!option) {
      throw new NotFoundException('해당 선택지를 찾을 수 없습니다.');
    }
    const { newContent, newScore, password } = updateDto;
    if (!newContent || !newScore) {
      throw new BadRequestException(
        '미기입된 항목이 있습니다. 모두 작성해주세요.',
      );
    } else if (!password) {
      throw new BadRequestException('비밀번호를 입력해주세요.');
    }
    if (survey.password !== password) {
      throw new UnauthorizedException(
        '권한이 없습니다. 비밀번호가 일치하지 않습니다.',
      );
    }
    const update = await this.optionsRepository.updateOption(
      optionId,
      newContent,
      newScore,
    );
  }

  // 옵션 삭제
  async deleteOption(
    surveyId: number,
    questionId: number,
    optionId: number,
    deleteDto: DeleteOptionDto,
  ) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const question = await this.questionsRepository.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('해당 질문을 찾을 수 없습니다.');
    }
    const option = await this.optionsRepository.getOptionById(optionId);
    if (!option) {
      throw new NotFoundException('해당 선택지를 찾을 수 없습니다.');
    }
    const { password } = deleteDto;
    if (!password) {
      throw new BadRequestException('비밀번호를 입력해주세요.');
    } else if (survey.password !== password) {
      throw new UnauthorizedException(
        '권한이 없습니다. 설문지 비밀번호와 일치하지 않습니다.',
      );
    }
    const remove = await this.optionsRepository.deleteOption(optionId);
    return remove;
  }
}
