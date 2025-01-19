export interface FormData {
	name: string;
	email: string;
	phone?: string;
	subject?: string;
	message: string;
	recipient: string;
	sender: string;
	customTemplate?: Express.Multer.File;
}
