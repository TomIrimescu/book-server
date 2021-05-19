import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { User } from '../models/User';
import bcrypt from "bcryptjs";
import { isPasswordValid } from "../common/validators/PasswordValidator";
import { isEmailValid } from "../common/validators/EmailValidator";
import { RegisterUserInput } from '../inputs/RegisterUserInput';
import { LoginUserInput } from '../inputs/LoginUserInput';
import { LogoutUserInput } from '../inputs/LogoutUserInput';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => User)
  user(@Arg("id") id: string) {
    return User.findOne({ where: { id } });
  }

  @Mutation(() => User)
  async registerUser(@Arg("data") data: RegisterUserInput) {

    const saltRounds = 10;

    const result = isPasswordValid(data.password);
    if (!result.isValid) {
      return {
        messages: [
          "Passwords must have min length 8, 1 upper character, 1 number, and 1 symbol",
        ],
      };
    }

    const trimmedEmail = data.email.trim().toLowerCase();
    const emailErrorMsg = isEmailValid(trimmedEmail);
    if (emailErrorMsg) {
      return {
        messages: [emailErrorMsg],
      };
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const userEntity = await User.create({
      email: trimmedEmail,
      userName: data.userName,
      password: hashedPassword,
    }).save();

    return userEntity;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("id") id: string) {
    const user = await User.findOne({ where: { id } });
    if (!user) throw new Error("User not found!");
    await user.remove();
    return true;
  }

  @Mutation(() => User)
  async loginUser(@Arg("data") data: LoginUserInput) {

    const user = await User.findOne({
      where: { userName: data.userName }
    });

    if (!user) {
      return {
        messages: ["User not found"],
      };
    }

    const passwordMatch = await bcrypt.compare(data.password, user?.password);
    if (!passwordMatch) {
      return {
        messages: ["Password is invalid."],
      };
    }

    return user;
  }

  @Mutation(() => User)
  async logoutUser(@Arg("data") data: LogoutUserInput) {
    const user = await User.findOne({ where: { userName: data.userName } });
    return user;
  }

}
