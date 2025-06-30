import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../schema/user.entity';
import * as bcrypt from 'bcrypt';
import { HttpException } from '../../common/exceptions/http-exception';
import { DtoValidatorService } from '../../common/validations/dto-validator.service';

describe('AuthService', () => {
  let service: AuthService | any;
  let userRepo: jest.Mocked<Repository<User>> | any;
  let jwtService: jest.Mocked<JwtService> | any;
  let exception: jest.Mocked<HttpException> | any;
  let dtoValidatorService: jest.Mocked<DtoValidatorService> | any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: HttpException,
          useValue: {
            responseHelper: jest.fn(),
          },
        },
        {
          provide: DtoValidatorService,
          useValue: {
            validateBody: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
    exception = module.get(HttpException);
    dtoValidatorService = module.get(DtoValidatorService);
  });

  describe('store', () => {
    it('should return error if email already exists', async () => {
      const dto = {
        email: 'test@mail.com',
        password: 'password123',
        fullName: 'Test Name',
      };

      dtoValidatorService.validateBody.mockResolvedValue({ status: 200 });

      userRepo.findOne.mockResolvedValue({
        id: 1,
        email: 'test@mail.com',
        password: 'hashed',
        fullName: 'Test Name',
      } as unknown as User);

      exception.responseHelper.mockResolvedValue({
        status: 409,
        message: 'Email already exists',
      });

      const result = await service.store(dto);
      expect(result.status).toBe(409);
      expect(result.message).toBe('Email already exists');
    });

    it('should create a new user if email does not exist', async () => {
      const dto = {
        email: 'new@mail.com',
        password: 'password123',
        fullName: 'New User',
      };

      dtoValidatorService.validateBody.mockResolvedValue({ status: 200 });

      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue({
        id: 1,
        ...dto,
        password: 'hashed',
      } as unknown as User);
      userRepo.save.mockResolvedValue({
        id: 1,
        ...dto,
        password: 'hashed',
      } as unknown as User);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed');
      exception.responseHelper.mockResolvedValue({
        status: 201,
        message: 'Success',
      });

      const result = await service.store(dto);
      expect(result.status).toBe(201);
      expect(result.message).toBe('Success');
    });

    it('should handle errors and call httpException in store', async () => {
      dtoValidatorService.validateBody.mockImplementation(() => {
        throw new Error('Fake validation error');
      });

      exception.responseHelper.mockResolvedValue({
        status: 500,
        message: 'Internal Server Error',
      });

      const dto = { email: 'test@mail.com', password: '123', fullName: 'Test' };

      const result = await service.store(dto);

      expect(exception.responseHelper).toHaveBeenCalledWith(500, 'Internal Server Error');
      expect(result.status).toBe(500);
      expect(result.message).toBe('Internal Server Error');
    });
  });

  describe('login', () => {
    it('should return error if email is not found', async () => {
      const dto = { email: 'notfound@mail.com', password: '123456' };

      dtoValidatorService.validateBody.mockResolvedValue({ status: 200 });

      userRepo.findOne.mockResolvedValue(null);
      exception.responseHelper.mockResolvedValue({
        status: 400,
        message: 'Email not found',
      });

      const result = await service.login(dto);
      expect(result.status).toBe(400);
      expect(result.message).toBe('Email not found');
    });

    it('should return error if password is incorrect', async () => {
      const dto = { email: 'test@mail.com', password: 'wrongPassword' };

      dtoValidatorService.validateBody.mockResolvedValue({ status: 200 });

      userRepo.findOne.mockResolvedValue({
        id: 1,
        email: 'test@mail.com',
        password: 'hashed',
        fullName: 'Test',
      } as unknown as User);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      exception.responseHelper.mockResolvedValue({
        status: 401,
        message: 'Invalid password',
      });

      const result = await service.login(dto);
      expect(result.status).toBe(401);
      expect(result.message).toBe('Invalid password');
    });

    it('should return token if login is valid', async () => {
      const dto = { email: 'test@mail.com', password: 'password123' };

      const mockUser = {
        id: 1,
        email: 'test@mail.com',
        password: 'hashed',
        fullName: 'Test',
      } as unknown as User;

      dtoValidatorService.validateBody.mockResolvedValue({ status: 200 });

      userRepo.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jwtService.sign.mockReturnValue('fake-jwt');
      exception.responseHelper.mockResolvedValue({
        status: 200,
        message: {
          jwt: { access_token: 'fake-jwt' },
          email: mockUser.email,
          name: mockUser.fullName,
        },
      });

      const result = await service.login(dto);
      expect(result.status).toBe(200);
      expect(result.message.jwt.access_token).toBe('fake-jwt');
    });

    it('should handle errors and call httpException in login', async () => {
      dtoValidatorService.validateBody.mockImplementation(() => {
        throw new Error('Fake validation error');
      });

      exception.responseHelper.mockResolvedValue({
        status: 500,
        message: 'Unexpected error',
      });

      const dto = { email: 'test@mail.com', password: '123' };

      const result = await service.login(dto);

      expect(exception.responseHelper).toHaveBeenCalledWith(500, 'Unexpected error');
      expect(result.status).toBe(500);
      expect(result.message).toBe('Unexpected error');
    });
  });
});