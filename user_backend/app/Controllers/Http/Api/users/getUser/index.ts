import { GetUserUseCase } from "./GetUserUseCase";
import { GetUserController } from "./GetUserController";

const getUserUseCase = new GetUserUseCase();
const getUserController = new GetUserController(getUserUseCase);

export { getUserController, getUserUseCase };
