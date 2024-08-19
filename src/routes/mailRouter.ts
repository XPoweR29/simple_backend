
import { Request, Response, Router } from "express";
import { FormData } from "../types/types";
import { MailController } from "../controllers/mail.controller";

export const mailRouter = Router();
const mailController = new MailController();

mailRouter

.post("/send-mail", mailController.sendMail.bind(mailController));
