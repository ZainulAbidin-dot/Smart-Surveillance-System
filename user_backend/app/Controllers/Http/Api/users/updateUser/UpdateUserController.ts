import { UpdateUserDTO } from "./UpdateUserDTO";
import BaseController from "../../../BaseController";
import { UpdateUserUseCase } from "./UpdateUserUseCase";
import { schema } from "@ioc:Adonis/Core/Validator";

export class UpdateUserController extends BaseController {
  private useCase: UpdateUserUseCase;

  constructor(useCase: UpdateUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: any, response: any): Promise<any> {
    const validations = await schema.create({
      name: schema.string.optional(),
      email: schema.string.optional(),
      password: schema.string(),
    });

    const payload = await request.validate({
      schema: validations,
      messages: {
        required: "The {{ field }} is required to create an account",
        "email.unique": "email not available",
      },
    });
    const dto: UpdateUserDTO = payload;
    const token = request.headers().authorization;

    try {
      const result = await this.useCase.execute(dto, token);

      const responseData = await this.successResponseParser(
        true,
        "User Update Detail",
        result
      );
      response.status(responseData.code).send(responseData);
    } catch (err: any) {
      console.log(err);
      const responseData = await this.successResponseParser(
        false,
        "User Update Detail",
        err.message
      );
      response.status(responseData.code).send(responseData);
      // this.exceptionHandler(err);
    }
  }
}
