import { GetAllAccessLinkUseCase } from "./GetAllAccessLinkUseCase";
import { GetAllAccessLinkController } from "./GetAllAccessLinkController";

const getAllAccessLinkUseCase = new GetAllAccessLinkUseCase();
const getAllAccessLinkController = new GetAllAccessLinkController(
  getAllAccessLinkUseCase
);

export { getAllAccessLinkController, getAllAccessLinkUseCase };
