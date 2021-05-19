import { InputType, Field } from "type-graphql";

@InputType()
export class LoginUserInput {
  @Field({ nullable: false })
  userName: string;

  @Field({ nullable: false })
  password: string;
}
