import { GetAllRoomsUseCase } from "./GetAllRoomsUseCase";
import { GetAllRoomsController } from "./GetAllRoomsController";
import TokenDecoder from "App/Controllers/Http/Helpers/TokenDecoder";

const getAllRoomsUseCase = new GetAllRoomsUseCase(new TokenDecoder());
const getAllRoomsController = new GetAllRoomsController(getAllRoomsUseCase);

export { getAllRoomsController, getAllRoomsUseCase };
