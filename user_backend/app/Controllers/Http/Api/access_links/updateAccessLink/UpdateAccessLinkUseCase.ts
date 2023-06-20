import { UpdateAccessLinkDTO } from "./UpdateAccessLinkDTO";
import AccessLink from "App/Models/AccessLink";

export class UpdateAccessLinkUseCase {
  constructor() {}

  public async execute(request: UpdateAccessLinkDTO): Promise<any> {
    try {
      const searchPayload = {
        device_id: request.deviceId,
        data: request.data,
      };
      const persistancePayload = {
        device_id: request.deviceId,
        data: request.data,
      };

      const result = await AccessLink.updateOrCreate(
        searchPayload,
        persistancePayload
      );

      return { access_link: result };
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
