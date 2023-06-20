import { LoginUseCase } from "./LoginUseCase";
import { LoginController } from "./LoginController";

const loginUseCase = new LoginUseCase();
const loginController = new LoginController(loginUseCase);

export { loginController, loginUseCase };
