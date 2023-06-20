import InternalServerErrorException from "App/Exceptions/InternalServerErrorException";
import { Exception } from "@adonisjs/core/build/standalone";
import { SessionContract } from "@ioc:Adonis/Addons/Session";

export default class BaseController {
  public STATUS_OK = 200;
  public STATUS_NOT_FOUND = 404;

  public async successResponseParser(
    status: boolean,
    message: string,
    data?: any
  ) {
    return await this.responseWrapper(this.STATUS_OK, message, status, data);
  }

  public async responseWrapper(
    code: number,
    message: string,
    status: boolean,
    data?: any
  ) {
    return {
      status,
      code,
      message,
      data: data ?? null,
    };
  }

  public async setFlashMessage(
    session: SessionContract,
    message: string,
    status: boolean
  ) {
    session.flash("alert", { status: status, message: message, isShow: true });
  }

  public async exceptionHandler(e: Exception) {
    console.log("exp", e);
    throw new InternalServerErrorException(e.message ?? e.message, e.status);
  }
}
