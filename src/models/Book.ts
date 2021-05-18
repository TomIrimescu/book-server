import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { TimeColumns } from './TimeColumns';

@Entity({ name: "Books" })
@ObjectType()
export class Book extends TimeColumns {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  author: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isPublished: boolean;
}
