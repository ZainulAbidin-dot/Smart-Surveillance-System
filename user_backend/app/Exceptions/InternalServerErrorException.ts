import { Exception } from "@adonisjs/core/build/standalone";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new InternalServerErrorException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class InternalServerErrorException extends Exception {
  public async handle(error: any, ctx: HttpContextContract) {
    ctx.response.status(error.status).send({
      status: false,
      code: 500,
      message: error.message,
      data: null,
    });
  }

  public report(error: this, ctx: HttpContextContract) {
    ctx.response.status(error.status).send({
      status: false,
      code: 500,
      message: error.message,
      data: null,
    });
  }
}
