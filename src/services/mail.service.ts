import sgMail from "@sendgrid/mail";
import { FormData } from "../types/types";
import * as dotenv from "dotenv";
dotenv.config();


export class MailService {
	constructor() {
		sgMail.setApiKey(process.env.API_KEY);
	}

	public async sendMail({
		name,
		phone = "",
		subject = "Nowa wiadomość",
		message,
		email,
		consent,
	}: FormData) {
		const msg = {
			to: "kontakt@webcraft-studio.pl",
			from: "kontakt@webcraft-studio.pl",
			subject: subject,
			text: message,
			html: ` <h1>Wiadomosć ze strony WebCraft-STUDIO</h1>
                    <br>
                    <p>Masz nową wiadomość od użytkownika: <strong>${name}</strong></p>
                    <p>${email}</p>
                    <p>${phone}</p>
                    <br><br>
                    <p><strong>${subject}</strong></p>
                    <p>${message}</p>
                    `,
		};

        await sgMail.send(msg);
	}
}
