import User from "App/Models/User";
import { LoginDTO } from "./LoginDTO";
import FcmToken from "App/Models/FcmToken";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export class LoginUseCase {
  constructor() {}

  public async execute(request: LoginDTO): Promise<any> {
    try {
      const userExist = await User.findBy("email", request.email);
      if (!userExist) {
        return "Account with these credentials do not exist";
      }
      const resultMatch = bcrypt.compareSync(
        request.password + request.email,
        userExist.$attributes.password
      );

      if (!resultMatch) {
        return "The credentials are incorrect";
      }

      const searchPayload = {
        user_id: userExist.id,
        fcm_token: request.fcmToken,
        device_id: request.deviceId,
      };
      const persistancePayload = {
        user_id: userExist.id,
        fcm_token: request.fcmToken,
        device_id: request.deviceId,
      };

      const result = await FcmToken.updateOrCreate(
        searchPayload,
        persistancePayload
      );

      if (!result) {
        return "FCM Token Error in Login";
      }

      const obj = {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
        password: userExist.password,
        fcm_token: result.fcm_token,
        device_id: result.device_id,
      };

      const token = jwt.sign({ user: userExist }, "shhhhh");
      return { user: obj ? obj : {}, token: token };
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
