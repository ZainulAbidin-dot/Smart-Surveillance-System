import { UpdateAccessLinkDTO } from "./UpdateAccessLinkDTO";
import BaseController from "../../../BaseController";
import { UpdateAccessLinkUseCase } from "./UpdateAccessLinkUseCase";
import { schema } from "@ioc:Adonis/Core/Validator";

export class UpdateAccessLinkController extends BaseController {
  private useCase: UpdateAccessLinkUseCase;

  constructor(useCase: UpdateAccessLinkUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: any, response: any): Promise<any> {
    const validations = await schema.create({
      deviceId: schema.string(),
      data: schema.string(),
    });

    const payload = await request.validate({
      schema: validations,
      messages: {
        required: "The {{ field }} is required to create an account",
        "email.unique": "email not available",
      },
    });

    const dto: UpdateAccessLinkDTO = payload;

    try {
      const result = await this.useCase.execute(dto);

      const responseData = await this.successResponseParser(
        true,
        "Access Link Detail",
        result
      );
      response.status(responseData.code).send(responseData);
    } catch (err: any) {
      console.log(err);
      const responseData = await this.successResponseParser(
        false,
        "Access Link Detail",
        err.message
      );
      response.status(responseData.code).send(responseData);
      // this.exceptionHandler(err);
    }
  }
}
