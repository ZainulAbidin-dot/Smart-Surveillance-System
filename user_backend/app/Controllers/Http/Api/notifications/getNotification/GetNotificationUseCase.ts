import TokenDecoder from "App/Controllers/Http/Helpers/TokenDecoder";
import Notification from "App/Models/Notification";

export class GetNotificationUseCase {
  private useCase: TokenDecoder;

  constructor(useCase: TokenDecoder) {
    this.useCase = useCase;
  }

  public async execute(request: any, userNotificationId: number): Promise<any> {
    try {
      const user = await this.useCase.decode(request);

      if (user.status === false) {
        return { status: false, value: user.value };
      }

      const notification = await Notification.query()
        .where("user_id", user.value.id)
        .andWhere("id", userNotificationId);

      if (notification.length < 1) {
        return { status: false, value: "Room not found" };
      }

      // console.log(notification[0]);
      // const device_data = await AccessLink.findBy(
      //   "device_id",
      //   room[0].device_id
      // );

      // if (!device_data) {
      //   return { status: false, value: "Device Data not found" };
      // }
      // const obj = {
      //   id: room[0].id,
      //   user_id: room[0].user_id,
      //   device_type: room[0].device_type,
      //   device_name: room[0].device_name,
      //   device_info: room[0].device_info,
      //   device_id: room[0].device_id,
      //   room_no: room[0].room_no,
      //   room_name: room[0].room_name,
      //   device_data: device_data.data,
      // };
      return { status: true, value: notification };
    } catch (err) {
      console.log(err);
      return { status: false, value: err };
    }
  }
}
