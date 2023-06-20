import { CreateRoomDTO } from "./CreateRoomDTO";
import BaseController from "../../../BaseController";
import { CreateRoomUseCase } from "./CreateRoomUseCase";
import { schema } from "@ioc:Adonis/Core/Validator";

export class CreateRoomController extends BaseController {
  private useCase: CreateRoomUseCase;

  constructor(useCase: CreateRoomUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: any, response: any): Promise<any> {
    const validations = await schema.create({
      device_type: schema.string(),
      device_name: schema.string(),
      device_id: schema.string(),
      device_info: schema.string(),
      room_no: schema.number(),
      room_name: schema.string(),
    });
    const payload = await request.validate({
      schema: validations,
      messages: {
        required: "The {{ field }} is required to create an account",
        "email.unique": "email not available",
      },
    });
    const headerToken = request.headers().authorization;
    const dto: CreateRoomDTO = payload;

    try {
      const result = await this.useCase.execute(dto, headerToken);

      const responseData = await this.successResponseParser(
        true,
        "Created Room Detail",
        result
      );
      response.status(responseData.code).send(responseData);
    } catch (err: any) {
      console.log(err);
      const responseData = await this.successResponseParser(
        false,
        "Created Room Detail",
        err.message
      );
      response.status(responseData.code).send(responseData);
      // this.exceptionHandler(err);
    }
  }
}
