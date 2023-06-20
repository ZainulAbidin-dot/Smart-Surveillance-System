import { UpdateUserUseCase } from "./UpdateUserUseCase";
import { UpdateUserController } from "./UpdateUserController";

const updateUserUseCase = new UpdateUserUseCase();
const updateUserController = new UpdateUserController(updateUserUseCase);

export { updateUserController, updateUserUseCase };
