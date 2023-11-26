import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Questions } from 'src/questions/entities/questions.entity';
import { Answers } from 'src/answers/entities/answers.entity';
import { Options } from 'src/options/entities/options.entity';

@Entity({ schema: 'surveyproject', name: 'Surveys' })
@ObjectType()
export class Surveys {
  constructor(partial?: Partial<Surveys>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  @Field(() => String)
  title: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  @Field(() => String)
  description: string;

  @Column({
    type: 'boolean',
    default: false,
    nullable: true,
  })
  @Field(() => Boolean, { defaultValue: false, nullable: true })
  isDone: boolean;

  @Column({ default: 0 })
  @Field(() => Int, { defaultValue: 0, nullable: true })
  totalScore: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  // 관계설정
  // Survey - Question : 1 : N 관계
  @OneToMany(() => Questions, (questions) => questions.survey, {
    cascade: true,
  })
  @Field(() => [Questions], { nullable: true })
  questions: Promise<Questions[]>; // Lazy Relations

  // Survey - Option : 1 : N 관계
  @OneToMany(() => Options, (options) => options.survey, {
    cascade: true,
  })
  @Field(() => [Options], { nullable: true })
  options: Promise<Options[]>; // Lazy Relations

  // Survey - Answer : 1 : N 관계
  @OneToMany(() => Answers, (answers) => answers.survey, {
    cascade: false,
  })
  @Field(() => [Answers], { nullable: true })
  answers: Promise<Answers[]>; // Lazy Relations
}