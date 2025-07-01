import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../schema/user.entity';
import { CreateUserDto, LoginUserDto } from '../../dto/auth.dto';
import { DtoValidatorService } from '../../common/validations/dto-validator.service';
import { HttpException } from '../../common/exceptions/http-exception';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly _user: Repository<User>,

        private readonly _jwtService: JwtService,
        private _httpException: HttpException,
        private _dtoValidatorService: DtoValidatorService
    ) { }

    async store(data) {
        try {
            const validate = await this._dtoValidatorService.validateBody(CreateUserDto, data);
            if (validate?.status === 400) {
                return await this._httpException.responseHelper(400, await validate.message);
            }

            const hashed = await bcrypt.hash(data.password, 10);

            const userExist = await this._user.findOne({ where: { email: data.email }, });
            if (userExist) {
                return await this._httpException.responseHelper(409, 'Email already exists');
            }

            const user = this._user.create({
                email: data.email,
                password: hashed,
                fullName: data.fullName
            });

            await this._user.save(user);

            return await this._httpException.responseHelper(201, 'Success');

        } catch (error) {
            console.error(error.message);
            return await this._httpException.responseHelper(500, 'Internal Server Error');
        }
    }

    async login(data) {
        try {
            const validate = await this._dtoValidatorService.validateBody(LoginUserDto, data);
            if (validate?.status === 400) {
                return await this._httpException.responseHelper(400, validate.message);
            }

            const user = await this._user.findOne({ where: { email: data.email } });
            if (!user) {
                return await this._httpException.responseHelper(404, 'Email not found');
            }

            const valid = await bcrypt.compare(data.password, user.password);
            if (!valid) {
                return await this._httpException.responseHelper(401, 'Invalid password');
            }

            const jwt = await this.generateJwt(user.id, user.email);
            if (!jwt?.access_token) {
                return await this._httpException.responseHelper(500, 'Token generation failed');
            }

            return await this._httpException.responseHelper(200, {
                jwt: jwt.access_token,
                email: user.email,
                name: user.fullName,
            });

        } catch (error) {
            console.error(error.message);
            return await this._httpException.responseHelper(500, 'Unexpected error');
        }
    }

    private async generateJwt(userId, email) {
        try {
            const payload = { sub: userId, email };
            return { access_token: await this._jwtService.sign(payload) };

        } catch (error) {
            console.error('JWT error:', error.message);
            return undefined;
        }
    }
}