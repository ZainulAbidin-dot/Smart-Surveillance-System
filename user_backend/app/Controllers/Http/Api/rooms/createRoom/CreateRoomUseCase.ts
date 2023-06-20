import { CreateRoomDTO } from "./CreateRoomDTO";
import UserRoom from "App/Models/UserRoom";
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

export class CreateRoomUseCase {
  constructor() {}

  public async execute(request: CreateRoomDTO, headerToken: any): Promise<any> {
    //   const userExist = await UserAllocatedDevice.findBy("email", request.device_id);
    //   if (userExist) {
    //     return "Account with this Email already exist";
    //   }

    const bearerToken = headerToken;

    if (!bearerToken) {
      return "No Token found";
    }
    const token = bearerToken.split(" ")[1];
    try {
      const decoded = await jwt.verify(token, "shhhhh");
      const isSignatureFine = !!decoded;
      if (!isSignatureFine) {
        return "Token signature expired.";
      }
      const { user } = decoded;

      const room = await UserRoom.create({
        user_id: user.id,
        device_type: request.device_type,
        device_name: request.device_name,
        device_id: request.device_id,
        device_info: request.device_info,
        room_name: request.room_name,
        room_no: request.room_no,
      });

      return { room: room, token: token };
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
