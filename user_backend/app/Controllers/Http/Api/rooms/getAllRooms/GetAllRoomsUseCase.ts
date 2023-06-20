import TokenDecoder from "App/Controllers/Http/Helpers/TokenDecoder";
import UserRoom from "App/Models/UserRoom";

export class GetAllRoomsUseCase {
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

      const allRooms = await UserRoom.query()
        .select("*")
        .where("user_id", user.value.id);

      if (allRooms.length < 1) {
        return { status: false, value: ["No room allocated"] };
      }

      return { status: true, value: allRooms };
    } catch (err) {
      console.log(err);
      return { status: false, value: [err] };
    }
  }
}
