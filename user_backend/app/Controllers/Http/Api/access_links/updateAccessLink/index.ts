import { UpdateAccessLinkUseCase } from "./UpdateAccessLinkUseCase";
import { UpdateAccessLinkController } from "./UpdateAccessLinkController";

const updateAccessLinkUseCase = new UpdateAccessLinkUseCase();
const updateAccessLinkController = new UpdateAccessLinkController(
  updateAccessLinkUseCase
);

export { updateAccessLinkController, updateAccessLinkUseCase };
