import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
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

  // 선택지 목록조회
  async getOptions(surveyId: number, questionId: number) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const question = await this.questionsRepository.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
    }
    const options = await this.optionsRepository.getOptions(questionId);
    if (!options.length) {
      throw new NotFoundException(
        '해당 문항의 선택지가 아직 존재하지 않습니다.',
      );
    }
    return options;
  }

  // 선택지 상세조회
  async getOptionById(surveyId: number, questionId: number, optionId: number) {
    const survey = await this.surveysRepository.getSurveyById(surveyId);
    if (!survey) {
      throw new NotFoundException('해당 설문지를 찾을 수 없습니다.');
    }
    const question = await this.questionsRepository.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
    }
    const option = await this.optionsRepository.getOptionById(optionId);
    if (!option) {
      throw new NotFoundException('해당 선택지를 찾을 수 없습니다.');
    }
    return option;
  }

  // 선택지 생성
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
      throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
    }
    const { number, content, score } = createDto;
    if (!number || !content || !score) {
      throw new BadRequestException(
        '미기입된 항목이 있습니다. 모두 작성해주세요. 선택지 번호 및 점수는 각각 1부터 5까지 생성 가능합니다.',
      );
    }
    const options = await this.optionsRepository.getOptions(questionId);
    const IsDuplicatedNumber = options.some(
      (option) => option.number === number,
    );
    if (!IsDuplicatedNumber) {
      throw new ConflictException(
        '중복된 번호의 다른 선택지가 이미 존재합니다. 선택지 번호는 1번부터 5번까지 가능하며, 다른 번호로 생성해주세요.',
      );
    }
    const IsDuplicatedContent = options.some(
      (option) => option.content === content,
    );
    if (!IsDuplicatedContent) {
      throw new ConflictException(
        '중복된 내용의 다른 선택지가 이미 존재합니다. 다른 내용을 입력해주세요.',
      );
    }
    const IsDuplicatedScore = options.some((option) => option.score === score);
    if (!IsDuplicatedScore) {
      throw new ConflictException(
        '중복된 점수의 다른 선택지가 이미 존재합니다. 선택지 점수는 1점부터 5점까지 가능하며, 다른 점수로 생성해주세요.',
      );
    }
    const create = await this.optionsRepository.createOption(createDto);
    return create;
  }

  // 선택지 수정
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
      throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
    }
    const option = await this.optionsRepository.getOptionById(optionId);
    if (!option) {
      throw new NotFoundException('해당 선택지를 찾을 수 없습니다.');
    }
    const { newNumber, newContent, newScore, password } = updateDto;
    if (!newNumber || !newContent || !newScore) {
      throw new BadRequestException(
        '미기입된 항목이 있습니다. 모두 작성해주세요. 선택지 번호 및 점수는 각각 1부터 5까지 수정 가능합니다.',
      );
    }
    const options = await this.optionsRepository.getOptions(questionId);
    const IsDuplicatedNumber = options.some(
      (option) => option.number === newNumber,
    );
    if (!IsDuplicatedNumber) {
      throw new ConflictException(
        '중복된 번호의 다른 선택지가 이미 존재합니다. 선택지 번호는 1번부터 5번까지 가능하며, 다른 번호로 수정해주세요.',
      );
    }
    const IsDuplicatedContent = options.some(
      (option) => option.content === newContent,
    );
    if (!IsDuplicatedContent) {
      throw new ConflictException(
        '중복된 내용의 다른 선택지가 이미 존재합니다. 다른 내용을 입력해주세요.',
      );
    }
    const IsDuplicatedScore = options.some(
      (option) => option.score === newScore,
    );
    if (!IsDuplicatedScore) {
      throw new ConflictException(
        '중복된 점수의 다른 선택지가 이미 존재합니다. 선택지 점수는 1점부터 5점까지 가능하며, 다른 점수로 수정해주세요.',
      );
    }
    if (!password) {
      throw new BadRequestException('비밀번호를 입력해주세요.');
    }
    const isPasswordValid = await bcrypt.compare(password, survey.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '권한이 없습니다. 비밀번호가 일치하지 않습니다.',
      );
    }
    const update = await this.optionsRepository.updateOption(
      optionId,
      newNumber,
      newContent,
      newScore,
    );
    return update;
  }

  // 선택지 삭제
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
      throw new NotFoundException('해당 문항을 찾을 수 없습니다.');
    }
    const option = await this.optionsRepository.getOptionById(optionId);
    if (!option) {
      throw new NotFoundException('해당 선택지를 찾을 수 없습니다.');
    }
    const { password } = deleteDto;
    if (!password) {
      throw new BadRequestException('비밀번호를 입력해주세요.');
    }
    const isPasswordValid = await bcrypt.compare(password, survey.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '권한이 없습니다. 비밀번호가 일치하지 않습니다.',
      );
    }
    const remove = await this.optionsRepository.deleteOption(optionId);
    return remove;
  }
}
