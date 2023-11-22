import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Surveys } from 'src/surveys/surveys.entity';
import { Questions } from 'src/questions/questions.entity';
import { Options } from 'src/options/options.entity';

@Entity({ schema: 'surveyProject', name: 'Answers' })
export class Answers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column()
  totalScore: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  // 관계설정
  // Answer - Survey : N : 1 관계
  @ManyToOne(() => Surveys, (survey) => survey.answer)
  @JoinColumn({ name: 'surveyId' })
  survey: Surveys;

  // Answer - Question : N : 1 관계
  @ManyToOne(() => Questions, (question) => question.answer)
  @JoinColumn({ name: 'questionId' })
  question: Questions;

  // Answer - Option : N : 1 관계
  @ManyToOne(() => Options, (option) => option.answer)
  @JoinColumn({ name: 'optionId' })
  option: Options;
}
