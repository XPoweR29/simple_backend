import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../types/httpExeptions";

export class ValidationError extends Error {
    statusCode: HttpStatus;

    constructor(message: string, statusCode: HttpStatus = 400) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ValidationError.prototype);
    };
};

export const handleError = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err);

    res
        .status(err instanceof ValidationError ? (err.statusCode) : 500)
        .json({
            message: err instanceof ValidationError ? err.message : `Wystąpił błąd, spróbój ponownie później..., ${err}`
        });
};