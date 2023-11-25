import { Test, TestingModule } from '@nestjs/testing';
import { AnswersResolver } from './answers.resolver';

describe('AnswersResolver', () => {
  let resolver: AnswersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnswersResolver],
    }).compile();

    resolver = module.get<AnswersResolver>(AnswersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
