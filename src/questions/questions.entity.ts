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
import { Answers } from 'src/answers/answers.entity';
import { Options } from 'src/options/options.entity';

@Entity({ schema: 'surveyProject', name: 'Questions' })
export class Questions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  content: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  // 관계설정
  // Question - Survey : N : 1 관계
  @ManyToOne(() => Surveys, (survey) => survey.question)
  @JoinColumn({ name: 'surveyId' })
  survey: Surveys;

  // Question - Option : 1 : N 관계
  @OneToMany(() => Options, (option) => option.question, {
    cascade: true,
  })
  option: Options[];

  // Question - Answer : 1 : N 관계
  @OneToMany(() => Answers, (answer) => answer.question, {
    cascade: false,
  })
  answer: Answers[];
}
