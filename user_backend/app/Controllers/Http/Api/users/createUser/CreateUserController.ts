import { CreateUserDTO } from "./CreateUserDTO";
import BaseController from "../../../BaseController";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { schema } from "@ioc:Adonis/Core/Validator";

export class CreateUserController extends BaseController {
  private useCase: CreateUserUseCase;

  constructor(useCase: CreateUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: any, response: any): Promise<any> {
    // {}, [
    //   rules.confirmed(),
    //   rules.regex(
    //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/
    //   ),
    // ]
    const validations = await schema.create({
      name: schema.string(),
      password: schema.string(),
      email: schema.string.optional(),
      deviceId: schema.string.optional(),
      fcmToken: schema.string.optional(),
    });

    const payload = await request.validate({
      schema: validations,
      messages: {
        required: "The {{ field }} is required to create an account",
        "email.unique": "email not available",
      },
    });
    const dto: CreateUserDTO = payload;

    try {
      const result = await this.useCase.execute(dto);

      const responseData = await this.successResponseParser(
        true,
        "SignUp Detail",
        result
      );
      response.status(responseData.code).send(responseData);
    } catch (err: any) {
      console.log(err);
      const responseData = await this.successResponseParser(
        false,
        "SignUp Detail",
        err.message
      );
      response.status(responseData.code).send(responseData);
      // this.exceptionHandler(err);
    }
  }
}
