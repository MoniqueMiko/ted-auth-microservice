import { Controller } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) { }

    @MessagePattern('auth/store')
    async store(@Payload() data) {
        return await this._authService.store(data)
    }

    @MessagePattern('auth/login')
    async login(@Payload() data) {
        return await this._authService.login(data)
    }
}