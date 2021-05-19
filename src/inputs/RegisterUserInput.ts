import { InputType, Field } from "type-graphql";

@InputType()
export class RegisterUserInput {
  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  userName: string;

  @Field({ nullable: false })
  password: string;
}
