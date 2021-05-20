import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from "typeorm";
import { Length } from "class-validator";
import { ObjectType, Field, ID } from "type-graphql";
import { TimeColumns } from './TimeColumns';

@Entity({ name: "Users" })
@ObjectType()
export class User extends TimeColumns {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ name: "Id", type: "bigint" })
  id: string;

  @Field(() => String)
  @Column("varchar", {
    name: "Email",
    length: 120,
    unique: true,
    nullable: false,
  })
  email: string;

  @Field(() => String)
  @Column("varchar", {
    name: "UserName",
    length: 60,
    unique: true,
    nullable: false,
  })
  userName: string;

  @Field(() => String)
  @Column("varchar", { name: "Password", length: 100, nullable: false })
  @Length(8, 100)
  password: string;

  @Field(() => Boolean)
  @Column("boolean", { name: "Confirmed", default: false, nullable: false })
  confirmed: boolean;

  @Field(() => Boolean)
  @Column("boolean", { name: "IsDisabled", default: false, nullable: false })
  isDisabled: boolean;
}
