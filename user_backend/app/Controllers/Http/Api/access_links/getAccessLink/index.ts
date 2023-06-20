import { GetAccessLinkUseCase } from "./GetAccessLinkUseCase";
import { GetAccessLinkController } from "./GetAccessLinkController";

const getAccessLinkUseCase = new GetAccessLinkUseCase();
const getAccessLinkController = new GetAccessLinkController(
  getAccessLinkUseCase
);

export { getAccessLinkController, getAccessLinkUseCase };
