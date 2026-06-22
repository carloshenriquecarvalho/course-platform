import { AppError } from "./app-error";

export class BadRequestError extends AppError {
    constructor(message = "BadRequest") {
        super(message, 400);
    }
}