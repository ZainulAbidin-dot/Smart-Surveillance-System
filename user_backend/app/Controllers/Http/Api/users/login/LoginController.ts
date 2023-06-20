import { LoginDTO } from "./LoginDTO";
import BaseController from "../../../BaseController";
import { LoginUseCase } from "./LoginUseCase";
import { schema } from "@ioc:Adonis/Core/Validator";

export class LoginController extends BaseController {
  private useCase: LoginUseCase;

  constructor(useCase: LoginUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: any, response: any): Promise<any> {
    const validations = await schema.create({
      email: schema.string(),
      password: schema.string(),
      fcmToken: schema.string.optional(),
      deviceId: schema.string.optional(),
    });

    const payload = await request.validate({
      schema: validations,
      messages: {
        required: "The {{ field }} is required to create an account",
        "email.unique": "email not available",
      },
    });
    const dto: LoginDTO = payload;

    try {
      const result = await this.useCase.execute(dto);

      const responseData = await this.successResponseParser(
        true,
        "Login Detail",
        result
      );
      response.status(responseData.code).send(responseData);
    } catch (err: any) {
      console.log(err);
      const responseData = await this.successResponseParser(
        false,
        "Login Detail",
        err.message
      );
      response.status(responseData.code).send(responseData);
      // this.exceptionHandler(err);
    }
  }
}
