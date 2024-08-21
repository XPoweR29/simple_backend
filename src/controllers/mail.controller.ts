
import { Request, Response } from "express";
import { MailService } from "../services/mail.service";
import { validateDTO } from "../utils/validateDTO";
import { SendMailDto } from "../DTO/email.dto";

export class MailController {
    private mailService: MailService;

    constructor() {
        this.mailService = new MailService();
    };

    public async sendMail(req: Request, res: Response): Promise<void> {
        const validData = await validateDTO(SendMailDto, req.body);
        await this.mailService.sendMail(validData);
        res.json({message: "Wiadomość zobstała poprawnie wysłana!"});
    };

    public gretting(req: Request, res: Response): void {
        res.status(200).send('SIMPLE BACKEND v.1.0');
    }
};