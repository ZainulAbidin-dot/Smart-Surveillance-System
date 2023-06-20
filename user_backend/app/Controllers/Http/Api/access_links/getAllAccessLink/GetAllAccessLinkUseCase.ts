import AccessLink from "App/Models/AccessLink";

export class GetAllAccessLinkUseCase {
  constructor() {}

  public async execute(request: any): Promise<any> {
    try {
      const result = await AccessLink.all();
      return { access_link: result ? result : [] };
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
