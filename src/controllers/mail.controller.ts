import { SendMailDto } from './../DTO/email.dto';
import { Request, Response } from "express";
import { MailService } from "../services/mail.service";
import { plainToInstance } from "class-transformer";

export class MailController {
    private mailService: MailService;

    constructor() {
        this.mailService = new MailService();
    };

    public async sendMail(req: Request, res: Response): Promise<void> {

        try {
            await this.mailService.sendMail(req.body);
            res.status(200).json({success: true, message: "Wiadomość została wysłana"});
        } catch(err) {
            console.error(`Błąd podczas wysyłania ${err}`);
            res.status(500).json({success: false, message: `Błąd podczas wysyałania wiadomośći`});
        };
    };

    public gretting(req: Request, res: Response): void {
        res.status(200).send("SIMPLE BACKEND");
    }
};