import User from "App/Models/User";
import { UpdateUserDTO } from "./UpdateUserDTO";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export class UpdateUserUseCase {
  constructor() {}

  public async execute(request: any, headerToken: any): Promise<any> {
    try {
      const bearerToken = headerToken;
      const updatedUser: UpdateUserDTO = request;

      if (bearerToken) {
        const token = bearerToken.split(" ")[1];
        const decoded = await jwt.verify(token, "shhhhh");
        const isSignatureFine = !!decoded;
        if (!isSignatureFine) {
          return "Token signature expired.";
        }
        const { user } = decoded;
        const userExist = await User.findBy("email", user.email);

        if (!userExist) {
          return "User with such an email does not exist";
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(
          updatedUser.password + updatedUser.email,
          saltRounds
        );
        userExist.name = updatedUser.name ? updatedUser.name : userExist.name;
        userExist.email = updatedUser.email
          ? updatedUser.email
          : userExist.email;
        userExist.password = hash;
        userExist.save();
        const newToken = jwt.sign({ user: userExist }, "shhhhh");
        return { user: userExist, token: newToken };
      } else {
        return "No Token found";
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
