import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Questions } from 'src/entities/questions.entity';
import { Answers } from 'src/entities/answers.entity';
import { Options } from 'src/entities/options.entity';
import { Users } from 'src/entities/user.entity';

@Entity({ schema: 'surveyproject', name: 'Surveys' })
@ObjectType()
export class Surveys {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @Field(() => String)
  title: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @Field(() => String)
  description: string;

  @Column({
    type: 'boolean',
    default: false,
    // nullable: true,
  })
  @Field(() => Boolean, { defaultValue: false })
  isDone: boolean;

  @Column({ default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  totalScore: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  @Field(() => Date)
  updatedAt: Date;

  // 관계설정
  // Survey - Question : 1 : N 관계
  @OneToMany(() => Questions, (questions) => questions.survey, {
    cascade: true,
  })
  @Field(() => [Questions], { nullable: false })
  questions: Promise<Questions[]>; // Lazy Relations

  // Survey - Option : 1 : N 관계
  @OneToMany(() => Options, (options) => options.survey, {
    cascade: true,
  })
  @Field(() => [Options])
  options: Promise<Options[]>; // Lazy Relations

  // Survey - Answer : 1 : N 관계
  @OneToMany(() => Answers, (answers) => answers.survey, {
    cascade: false,
  })
  @Field(() => [Answers])
  answers: Promise<Answers[]>; // Lazy Relations

  // Survey - User : N : 1 관계
  @ManyToOne(() => Users, (user) => user.surveys, {
    cascade: false,
  })
  @JoinColumn({ name: 'userId' })
  user: Promise<Users>;
  @Column({ nullable: true })
  userId: number;
}
