import TokenDecoder from "App/Controllers/Http/Helpers/TokenDecoder";
import UserRoom from "App/Models/UserRoom";

export class SearchRoomUseCase {
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
      const { searchQuery } = request.body();

      const room = await UserRoom.query()
        .whereILike("room_name", `%${searchQuery}%`)
        .orWhereILike("device_name", `%${searchQuery}%`)
        .orWhereILike("device_type", `%${searchQuery}%`)
        .andWhere("user_id", user.value.id);

      if (room.length < 1) {
        return { status: false, value: "Room not found" };
      }

      return { status: true, value: room };
    } catch (err) {
      console.log(err);
      return { status: false, value: err };
    }
  }
}
