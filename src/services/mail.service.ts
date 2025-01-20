import sgMail from '@sendgrid/mail';
import { FormData } from '../types/types';
import * as dotenv from 'dotenv';
import { serverLog } from '../utils/serverLog';
import path from 'path';
import * as fs from 'fs/promises';
import { ValidationError } from '../middlewares/handleError';
import { HttpStatus } from '../types/httpExeptions';
dotenv.config();

export class MailService {
	constructor() {
		if (!process.env.API_KEY) {
			throw new ValidationError(
				'API_KEY is not defined in the environment variables',
				HttpStatus.NOT_FOUND
			);
		}
		sgMail.setApiKey(process.env.API_KEY);
	}

	public async sendMail({
		name,
		phone = '',
		subject = 'Nowa wiadomość',
		message,
		email,
		recipient,
		sender,
		customTemplate,
	}: FormData) {
		let mailTemplate: string;

		if (customTemplate) {
			mailTemplate = customTemplate.buffer.toString('utf-8');
		} else {
			const templatePath = path.join(
				__dirname,
				'../templates/default_template.html'
			);
			mailTemplate = await fs.readFile(templatePath, 'utf-8');
		}
		mailTemplate = mailTemplate.replace(/{{(\w+)}}/g, (_, key: string) => {
			const variables: Record<string, string> = {
				name,
				phone,
				subject,
				message,
				email,
			};
			return variables[key] || '';
		});

		const msg = {
			to: recipient,
			from: sender,
			subject: subject,
			text: message,
			html: mailTemplate,
			replyTo: email,
		};

		await sgMail.send(msg);
		serverLog(`Email has been sent successfully to ${recipient}`);
	}
}