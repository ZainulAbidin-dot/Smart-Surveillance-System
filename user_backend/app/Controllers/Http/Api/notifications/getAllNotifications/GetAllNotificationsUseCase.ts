import TokenDecoder from "App/Controllers/Http/Helpers/TokenDecoder";
import Notification from "App/Models/Notification";

export class GetAllNotificationsUseCase {
  private useCase: TokenDecoder;

  constructor(useCase: TokenDecoder) {
    this.useCase = useCase;
  }

  public async execute(request: any): Promise<any> {
    try {
      const user = await this.useCase.decode(request);

      if (user.status === false) {
        return { status: false, value: user.value };
      }

      const allRooms = await Notification.query()
        .select("*")
        .where("user_id", user.value.id);

      if (allRooms.length < 1) {
        return { status: false, value: ["No notifications found"] };
      }

      return { status: true, value: allRooms };
    } catch (err) {
      console.log(err);
      return { status: false, value: [err] };
    }
  }
}
