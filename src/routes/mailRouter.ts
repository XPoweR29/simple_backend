
import { Router } from "express";
import { MailController } from "../controllers/mail.controller";

export const mailRouter = Router();
const mailController = new MailController();

mailRouter

.get('/', mailController.gretting.bind(mailController))

.post("/send-mail", mailController.sendMail.bind(mailController));
