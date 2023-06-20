import { GetAllNotificationsUseCase } from "./GetAllNotificationsUseCase";
import { GetAllNotificationsController } from "./GetAllNotificationsController";
import TokenDecoder from "App/Controllers/Http/Helpers/TokenDecoder";

const getAllNotificationsUseCase = new GetAllNotificationsUseCase(
  new TokenDecoder()
);
const getAllNotificationsController = new GetAllNotificationsController(
  getAllNotificationsUseCase
);

export { getAllNotificationsController, getAllNotificationsUseCase };
