import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Surveys } from 'src/entities/surveys.entity';
import { Answers } from 'src/entities/answers.entity';
import { Options } from 'src/entities/options.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Users } from './user.entity';

@Entity({ schema: 'surveyproject', name: 'Questions' })
@ObjectType()
export class Questions {
  constructor(partial?: Partial<Questions>) {
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
  questionNumber: number;

  @Column({
    type: 'varchar',
  })
  @Field(() => String)
  content: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  @Field(() => Boolean, { defaultValue: false })
  isAnswered: boolean;

  @Column({ default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  questionScore: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  @Field(() => Date)
  updatedAt: Date;

  // 관계설정
  // Question - Survey : N : 1 관계
  @ManyToOne(() => Surveys, (survey) => survey.questions)
  @JoinColumn({ name: 'surveyId' })
  @Field(() => Surveys, { nullable: false })
  survey: Promise<Surveys>; // Lazy Relations

  // Question - Option : 1 : N 관계
  @OneToMany(() => Options, (options) => options.question, {
    cascade: true,
  })
  @Field(() => [Options])
  options: Promise<Options[]>; // Lazy Relations

  // Question - Answer : 1 : 1 관계
  @OneToOne(() => Answers, (answer) => answer.question, {
    cascade: false,
  })
  @Field(() => [Answers])
  answer: Answers;

  // Question - User : N : 1 관계
  @ManyToOne(() => Users, (user) => user.questions)
  @JoinColumn({ name: 'userId' })
  user: Promise<Users>;
  @Column({ nullable: true })
  @Field(() => [Users])
  userId: number;
}
