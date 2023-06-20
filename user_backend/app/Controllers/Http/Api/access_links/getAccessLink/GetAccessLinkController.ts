import BaseController from "../../../BaseController";
import { GetAccessLinkUseCase } from "./GetAccessLinkUseCase";

export class GetAccessLinkController extends BaseController {
  private useCase: GetAccessLinkUseCase;

  constructor(useCase: GetAccessLinkUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: any, params: any, response: any): Promise<any> {
    try {
      const { deviceId } = params;
      const result = await this.useCase.execute(request, deviceId);

      const responseData = await this.successResponseParser(
        true,
        "Get Access Link",
        result
      );
      response.status(responseData.code).send(responseData);
    } catch (err: any) {
      console.log(err);
      const responseData = await this.successResponseParser(
        false,
        "Get Access Link",
        err.message
      );
      response.status(responseData.code).send(responseData);
      // this.exceptionHandler(err);
    }
  }
}
