import { CreateAccessLinkDTO } from "./CreateAccessLinkDTO";
import AccessLink from "App/Models/AccessLink";

export class CreateAccessLinkUseCase {
  constructor() {}

  public async execute(request: CreateAccessLinkDTO): Promise<any> {
    try {
      const user = await AccessLink.create({
        data: request.data,
        device_id: request.deviceId,
      });

      return { access_link: user };
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
