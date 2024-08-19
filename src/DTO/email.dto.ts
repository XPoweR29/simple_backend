import {IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional, IsPhoneNumber } from "class-validator";

export class SendMailDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;
    
	@IsNotEmpty()
	phone: string;

	@IsString()
	@IsNotEmpty()
	subject: string;

	@IsString()
	@IsNotEmpty()
	message: string;

	@IsBoolean()
	consent: boolean;
}
