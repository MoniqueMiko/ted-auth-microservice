import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { HttpException } from "../exceptions/http-exception";

@Injectable()
export class DtoValidatorService {
    constructor(private _httpException: HttpException) { }

    async validateBody(dto, data) {
        try {
            if (!dto) return;

            const instance = plainToInstance(dto, data);
            const errors = await validate(instance);

            if (errors.length > 0) {
                const messages = errors
                    .map(err => (err.constraints ? Object.values(err.constraints) : []))
                    .flat();

                return this._httpException.responseHelper(400, messages.join(', '));
            }

        } catch (error) {
            console.error(error.message);
        }
    }
}