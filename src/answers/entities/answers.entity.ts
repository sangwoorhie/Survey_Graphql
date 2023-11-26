import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Surveys } from 'src/surveys/entities/surveys.entity';
import { Questions } from 'src/questions/entities/questions.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity({ schema: 'surveyproject', name: 'Answers' })
@ObjectType()
export class Answers {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'int', nullable: false })
  @Field(() => Int)
  answerNumber: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  @Field(() => Date)
  updatedAt: Date;

  // 관계설정
  // Answers - Surveys : N : 1 관계
  @ManyToOne(() => Surveys, (survey) => survey.answers)
  @Field(() => Surveys, { nullable: true })
  survey: Promise<Surveys>;

  // Answers - Questions : 1 : 1 관계
  @OneToOne(() => Questions, (question) => question.answer)
  @JoinColumn()
  @Field(() => [Questions], { nullable: false })
  question: Questions;
}