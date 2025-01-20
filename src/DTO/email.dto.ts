import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	Matches,
	MinLength,
} from 'class-validator';

export class SendMailDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@Matches(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/, {
		message: 'Name can only contain letters',
	})
	name: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsOptional()
	@IsPhoneNumber('PL', { message: 'Invalid phone number format' })
	phone?: string;

	@IsOptional()
	@IsString()
	subject: string;

	@IsString()
	@IsNotEmpty()
	message: string;

	@IsEmail()
	@IsNotEmpty()
	recipient: string;

	@IsEmail()
	@IsNotEmpty()
	sender: string;

	@IsOptional()
	customTemplate: Express.Multer.File
}
