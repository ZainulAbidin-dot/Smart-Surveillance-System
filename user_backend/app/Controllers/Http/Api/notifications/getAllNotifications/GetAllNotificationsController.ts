import BaseController from "../../../BaseController";
import { GetAllNotificationsUseCase } from "./GetAllNotificationsUseCase";

export class GetAllNotificationsController extends BaseController {
  private useCase: GetAllNotificationsUseCase;

  constructor(useCase: GetAllNotificationsUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: any, response: any): Promise<any> {
    try {
      const result = await this.useCase.execute(request);

      const responseData = await this.successResponseParser(
        result.status,
        "Get All Notifications",
        result.value
      );
      response.status(responseData.code).send(responseData);
    } catch (err: any) {
      console.log(err);
      const responseData = await this.successResponseParser(
        false,
        "Get All Notifications",
        err.message
      );
      response.status(responseData.code).send(responseData);
      // this.exceptionHandler(err);
    }
  }
}
