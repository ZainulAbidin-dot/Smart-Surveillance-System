import AccessLink from "App/Models/AccessLink";

export class GetAccessLinkUseCase {
  constructor() {}

  public async execute(request: any, deviceId: any): Promise<any> {
    try {
      const result = await AccessLink.findBy("device_id", deviceId);
      return { access_link: result ? result : [] };
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
