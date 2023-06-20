import BaseController from "../../../BaseController";
import { GetNotificationUseCase } from "./GetNotificationUseCase";

export class GetNotificationController extends BaseController {
  private useCase: GetNotificationUseCase;

  constructor(useCase: GetNotificationUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: any, params: any, response: any): Promise<any> {
    try {
      const { userNotificationId } = params;
      const result = await this.useCase.execute(request, userNotificationId);

      const responseData = await this.successResponseParser(
        result.status,
        "Get Notification",
        result.value
      );
      response.status(responseData.code).send(responseData);
    } catch (err: any) {
      console.log(err);
      const responseData = await this.successResponseParser(
        false,
        "Get Notification",
        err.message
      );
      response.status(responseData.code).send(responseData);
      // this.exceptionHandler(err);
    }
  }
}
