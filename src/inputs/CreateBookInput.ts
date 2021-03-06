import { InputType, Field } from "type-graphql";

@InputType()
export class CreateBookInput {
  @Field({ nullable: false })
  title: string;

  @Field({ nullable: false })
  author: string;
}
