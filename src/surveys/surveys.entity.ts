import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Questions } from 'src/questions/questions.entity';
import { Answers } from 'src/answers/answers.entity';

@Entity({ schema: 'surveyproject', name: 'Surveys' })
export class Surveys {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isAnswered: boolean;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  // 관계설정
  // Survey - Question : 1 : N 관계
  @OneToMany(() => Questions, (question) => question.survey, {
    cascade: true,
  })
  question: Questions[];

  // Survey - Answer : 1 : N 관계
  @OneToMany(() => Answers, (answer) => answer.survey, {
    cascade: false,
  })
  answer: Answers[];
}
