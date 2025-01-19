import { validate } from "class-validator";
import { ValidationError } from "../middlewares/handleError";

export async function validateDTO<T extends object>(dtoClass: new () => T, data: any): Promise<T> {
    const dto = new dtoClass();
    Object.assign(dto, data);

    const errors = await validate(dto);
    if (errors.length > 0) {

        const errMessage = errors
            .map(error => Object.values(error.constraints))
            .join(', ');
        throw new ValidationError(errMessage);
    };

    return dto;
}