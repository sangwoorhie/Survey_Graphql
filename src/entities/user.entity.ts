import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Status } from 'src/auth/common/userinfo';
import { Surveys } from 'src/entities/surveys.entity';
import { Answers } from 'src/entities/answers.entity';

registerEnumType(Status, {
  name: 'Status',
});

@Entity({ schema: 'surveyproject', name: 'Users' })
@ObjectType()
export class Users {
  constructor(partial?: Partial<Users>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
  })
  @Field(() => String)
  email: string;

  @Column({ type: 'varchar', length: 30 })
  @Field(() => String)
  password: string;

  @Column({
    type: 'varchar',
  })
  @Field(() => String)
  name: string;

  @Column({ type: 'enum', enum: Status, default: Status.PROFESSOR })
  @Field(() => Status)
  status: Status;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  @Field(() => Date)
  updatedAt: Date;

  // 관계설정
  // User - Survey : N : N 관계
  @ManyToMany(() => Surveys, (surveys) => surveys.users, {
    cascade: false,
  })
  @JoinTable()
  @Field(() => [Surveys])
  surveys: Surveys[];

  // User - Answer : 1 : N 관계
  @OneToMany(() => Answers, (answers) => answers.user, {
    cascade: false,
  })
  @Field(() => [Answers])
  answers: Promise<Answers[]>; // Lazy Relations
}
