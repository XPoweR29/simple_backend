import {IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MinLength } from "class-validator";

export class SendMailDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@Matches(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/, { message: 'Name can only contain letters' })
	name: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;
    
	@IsNotEmpty()
	@IsPhoneNumber("PL")
	phone: string;

	@IsString()
	@IsNotEmpty()
	subject: string;

	@IsString()
	@IsNotEmpty()
	message: string;
}
