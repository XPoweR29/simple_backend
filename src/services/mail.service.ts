import sgMail from "@sendgrid/mail";
import { FormData } from "../types/types";
import * as dotenv from "dotenv";
import { serverLog } from "../utils/serverLog";
import path from "path";
import * as fs from "fs";
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
	}: FormData) {
		const templatePath = path.join(__dirname, "../templates/WCSmailTemplate/mailTemplate.html");
		let mailTemplate = fs.readFileSync(templatePath, "utf-8");
			mailTemplate = mailTemplate.replace("{{name}}", name);
			mailTemplate = mailTemplate.replace("{{phone}}", phone);
			mailTemplate = mailTemplate.replace("{{subject}}", subject);
			mailTemplate = mailTemplate.replace("{{message}}", message);
			mailTemplate = mailTemplate.replace("{{email}}", email);

		const msg = {
			to: "kontakt@webcraft-studio.pl",
			from: "kontakt@webcraft-studio.pl",
			subject: subject,
			text: message,
			html: mailTemplate,
		};

        await sgMail.send(msg);
		serverLog("Email has been sent successfully");
	}
}
