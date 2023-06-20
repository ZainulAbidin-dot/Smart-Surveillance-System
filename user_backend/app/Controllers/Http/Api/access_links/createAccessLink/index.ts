import { CreateAccessLinkUseCase } from "./CreateAccessLinkUseCase";
import { CreateAccessLinkController } from "./CreateAccessLinkController";

const createAccessLinkUseCase = new CreateAccessLinkUseCase();
const createAccessLinkController = new CreateAccessLinkController(
  createAccessLinkUseCase
);

export { createAccessLinkController, createAccessLinkUseCase };
