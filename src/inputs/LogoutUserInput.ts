import { InputType, Field } from "type-graphql";

@InputType()
export class LogoutUserInput {
  @Field({ nullable: false })
  userName: string;
}
