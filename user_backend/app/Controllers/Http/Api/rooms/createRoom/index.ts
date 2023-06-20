import { CreateRoomUseCase } from "./CreateRoomUseCase";
import { CreateRoomController } from "./CreateRoomController";

const createRoomUseCase = new CreateRoomUseCase();
const createRoomController = new CreateRoomController(createRoomUseCase);

export { createRoomController, createRoomUseCase };
