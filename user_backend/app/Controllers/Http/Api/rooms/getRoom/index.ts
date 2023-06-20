import { GetRoomUseCase } from "./GetRoomUseCase";
import { GetRoomController } from "./GetRoomController";
import TokenDecoder from "App/Controllers/Http/Helpers/TokenDecoder";

const getRoomUseCase = new GetRoomUseCase(new TokenDecoder());
const getRoomController = new GetRoomController(getRoomUseCase);

export { getRoomController, getRoomUseCase };
