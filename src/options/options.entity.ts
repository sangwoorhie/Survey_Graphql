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

import { Questions } from 'src/questions/questions.entity';
import { Answers } from 'src/answers/answers.entity';

@Entity({ schema: 'surveyproject', name: 'Options' })
export class Options {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  content: string;

  @Column()
  score: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  // 관계설정
  // Options - Answers : 1 : N 관계
  @OneToMany(() => Answers, (answer) => answer.option, {
    cascade: false,
  })
  answer: Answers[];

  // Options - Questions : N : 1 관계
  @ManyToOne(() => Questions, (question) => question.option)
  @JoinColumn({ name: 'questionId' })
  question: Questions;
}
