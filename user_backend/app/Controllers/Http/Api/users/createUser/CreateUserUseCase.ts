import User from "App/Models/User";
import { CreateUserDTO } from "./CreateUserDTO";
import FcmToken from "App/Models/FcmToken";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export class CreateUserUseCase {
  constructor() {}

  public async execute(request: CreateUserDTO): Promise<any> {
    try {
      const userExist = await User.findBy("email", request.email);
      if (userExist) {
        return "Account with this Email already exist";
      }

      const saltRounds = 10;
      const hash = await bcrypt.hash(
        request.password + request.email,
        saltRounds
      );

      const user = await User.create({
        name: request.name,
        email: request.email,
        password: hash,
      });
      const fcm_token = await FcmToken.create({
        user_id: user.id,
        fcm_token: request.fcmToken,
        device_id: request.deviceId,
      });
      console.log(fcm_token);
      if (!fcm_token) {
        return "No Fcm Token found";
      }
      const token = jwt.sign({ user: user }, "shhhhh");
      return { user: user, token: token };
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
