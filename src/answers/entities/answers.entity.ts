import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Surveys } from 'src/surveys/entities/surveys.entity';
import { Questions } from 'src/questions/entities/questions.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Users } from 'src/users/entities/user.entity';

@Entity({ schema: 'surveyproject', name: 'Answers' })
@ObjectType()
export class Answers {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'int', nullable: false })
  @Field(() => Int)
  surveyId: number;

  @Column({ type: 'int', nullable: false })
  @Field(() => Int)
  questionId: number;

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
  @JoinColumn({ name: 'surveyId' })
  @Field(() => Surveys, { nullable: false })
  survey: Promise<Surveys>;

  // Answers - Questions : 1 : 1 관계
  @OneToOne(() => Questions, (question) => question.answer)
  @JoinColumn({ name: 'questionId' })
  @Field(() => [Questions], { nullable: false })
  question: Questions;

  // Answer - User : N : 1 관계
  @ManyToOne(() => Users, (user) => user.answers)
  @JoinColumn({ name: 'userId' })
  @Field(() => Users, { nullable: false })
  user: Promise<Users>;
}
