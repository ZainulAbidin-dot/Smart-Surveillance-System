import BaseController from "../../../BaseController";
import { GetUserUseCase } from "./GetUserUseCase";

export class GetUserController extends BaseController {
  private useCase: GetUserUseCase;

  constructor(useCase: GetUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: any, response: any): Promise<any> {
    try {
      const result = await this.useCase.execute(request);

      const responseData = await this.successResponseParser(
        true,
        "Get User",
        result
      );
      response.status(responseData.code).send(responseData);
    } catch (err: any) {
      console.log(err);
      const responseData = await this.successResponseParser(
        false,
        "Get User",
        err.message
      );
      response.status(responseData.code).send(responseData);
      // this.exceptionHandler(err);
    }
  }
}
