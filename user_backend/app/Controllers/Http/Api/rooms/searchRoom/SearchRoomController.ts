import BaseController from "../../../BaseController";
import { SearchRoomUseCase } from "./SearchRoomUseCase";

export class SearchRoomController extends BaseController {
  private useCase: SearchRoomUseCase;

  constructor(useCase: SearchRoomUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: any, response: any): Promise<any> {
    try {
      const result = await this.useCase.execute(request);

      const responseData = await this.successResponseParser(
        result.status,
        "Get All Rooms",
        result.value
      );
      response.status(responseData.code).send(responseData);
    } catch (err: any) {
      console.log(err);
      const responseData = await this.successResponseParser(
        false,
        "Get All Rooms",
        err.message
      );
      response.status(responseData.code).send(responseData);
      // this.exceptionHandler(err);
    }
  }
}
