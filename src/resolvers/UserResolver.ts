import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { User } from '../models/User';
// import bcrypt from "bcryptjs";
// import { isPasswordValid } from "../common/validators/PasswordValidator";
// import { isEmailValid } from "../common/validators/EmailValidator";
import { RegisterUserInput } from '../inputs/RegisterUserInput';

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
    const user = User.create(data);
    await user.save();
    return user;
  }

}

// const saltRounds = 10;

// export class UserResult {
//   constructor(public messages?: Array<string>, public user?: User) { }
// }

// export const register = async (
//   email: string,
//   userName: string,
//   password: string
// ): Promise<UserResult> => {
//   const result = isPasswordValid(password);
//   if (!result.isValid) {
//     return {
//       messages: [
//         "Passwords must have min length 8, 1 upper character, 1 number, and 1 symbol",
//       ],
//     };
//   }

//   const trimmedEmail = email.trim().toLowerCase();
//   const emailErrorMsg = isEmailValid(trimmedEmail);
//   if (emailErrorMsg) {
//     return {
//       messages: [emailErrorMsg],
//     };
//   }

//   const salt = await bcrypt.genSalt(saltRounds);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   const userEntity = await User.create({
//     email: trimmedEmail,
//     userName,
//     password: hashedPassword,
//   }).save();

//   userEntity.password = ""; // blank out for security
//   return {
//     user: userEntity,
//   };
// };

// export const login = async (
//   userName: string,
//   password: string
// ): Promise<UserResult> => {
//   const user = await User.findOne({
//     where: { userName },
//   });
//   if (!user) {
//     return {
//       messages: [userNotFound(userName)],
//     };
//   }

//   if (!user.confirmed) {
//     return {
//       messages: ["User has not confirmed their registration email yet."],
//     };
//   }

//   const passwordMatch = await bcrypt.compare(password, user?.password);
//   if (!passwordMatch) {
//     return {
//       messages: ["Password is invalid."],
//     };
//   }

//   return {
//     user: user,
//   };
// };

// export const logout = async (userName: string): Promise<string> => {
//   const user = await User.findOne({
//     where: { userName },
//   });

//   if (!user) {
//     return userNotFound(userName);
//   }

//   return "User logged off.";
// };

// function userNotFound(userName: string) {
//   return `User with userName ${userName} not found.`;
// }
