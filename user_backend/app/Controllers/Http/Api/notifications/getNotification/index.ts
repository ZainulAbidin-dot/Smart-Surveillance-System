import { GetNotificationUseCase } from "./GetNotificationUseCase";
import { GetNotificationController } from "./GetNotificationController";
import TokenDecoder from "App/Controllers/Http/Helpers/TokenDecoder";

const getNotificationUseCase = new GetNotificationUseCase(new TokenDecoder());
const getNotificationController = new GetNotificationController(
  getNotificationUseCase
);

export { getNotificationController, getNotificationUseCase };
