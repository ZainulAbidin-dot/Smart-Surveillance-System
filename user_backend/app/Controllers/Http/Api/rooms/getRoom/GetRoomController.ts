import BaseController from "../../../BaseController";
import { GetRoomUseCase } from "./GetRoomUseCase";

export class GetRoomController extends BaseController {
  private useCase: GetRoomUseCase;

  constructor(useCase: GetRoomUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: any, params: any, response: any): Promise<any> {
    try {
      const { userRoomId } = params;
      const result = await this.useCase.execute(request, userRoomId);

      const responseData = await this.successResponseParser(
        result.status,
        "Get Room",
        result.value
      );
      response.status(responseData.code).send(responseData);
    } catch (err: any) {
      console.log(err);
      const responseData = await this.successResponseParser(
        false,
        "Get Room",
        err.message
      );
      response.status(responseData.code).send(responseData);
      // this.exceptionHandler(err);
    }
  }
}
