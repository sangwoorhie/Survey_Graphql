import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Questions } from 'src/entities/questions.entity';
import { Surveys } from 'src/entities/surveys.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity({ schema: 'surveyproject', name: 'Options' })
@ObjectType()
export class Options {
  constructor(partial?: Partial<Options>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'int', nullable: false })
  @Field(() => Int)
  surveyId: number;

  @Column({ type: 'int', nullable: false })
  @Field(() => Int)
  questionId: number;

  @Column({ type: 'int' })
  @Field(() => Int)
  optionNumber: number;

  @Column({
    type: 'varchar',
    // unique: true,
  })
  @Field(() => String)
  content: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  optionScore: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  @Field(() => Date)
  updatedAt: Date;

  // 관계설정
  // Options - Survey : N : 1 관계
  @ManyToOne(() => Surveys, (survey) => survey.options)
  @Field(() => Surveys, { nullable: false })
  @JoinColumn({ name: 'surveyId' })
  survey: Promise<Surveys>;

  // Options - Questions : N : 1 관계
  @ManyToOne(() => Questions, (question) => question.options)
  @Field(() => Questions, { nullable: false })
  @JoinColumn({ name: 'questionId' })
  question: Promise<Questions>;
}
