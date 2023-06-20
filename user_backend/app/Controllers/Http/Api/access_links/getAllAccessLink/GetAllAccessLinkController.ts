import BaseController from "../../../BaseController";
import { GetAllAccessLinkUseCase } from "./GetAllAccessLinkUseCase";

export class GetAllAccessLinkController extends BaseController {
  private useCase: GetAllAccessLinkUseCase;

  constructor(useCase: GetAllAccessLinkUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: any, response: any): Promise<any> {
    try {
      const result = await this.useCase.execute(request);

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
