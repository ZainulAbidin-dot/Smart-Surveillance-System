import { SearchRoomUseCase } from "./SearchRoomUseCase";
import { SearchRoomController } from "./SearchRoomController";
import TokenDecoder from "App/Controllers/Http/Helpers/TokenDecoder";

const searchRoomUseCase = new SearchRoomUseCase(new TokenDecoder());
const searchRoomController = new SearchRoomController(searchRoomUseCase);

export { searchRoomController, searchRoomUseCase };
