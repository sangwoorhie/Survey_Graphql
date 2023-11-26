import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Questions } from 'src/questions/entities/questions.entity';
import { Surveys } from 'src/surveys/entities/surveys.entity';
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
  optionNumber: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  @Field(() => String)
  content: string;

  @Column({ type: 'int', nullable: false })
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
  @Field(() => Surveys, { nullable: true })
  survey: Promise<Surveys>; // Lazy Relations

  // Options - Questions : N : 1 관계
  @ManyToOne(() => Questions, (question) => question.options)
  @Field(() => Questions, { nullable: true })
  question: Promise<Questions>; // Lazy Relations
}
