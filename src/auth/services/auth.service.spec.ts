import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../schema/user.entity';
import { HttpException } from '../../exceptions/http-exception';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: jest.Mocked<Repository<User>>;
  let jwtService: jest.Mocked<JwtService>;
  let exception: jest.Mocked<HttpException>;

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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
    exception = module.get(HttpException);
  });

  describe('store', () => {
    it('should return error if email already exists', async () => {
      const dto = {
        email: 'test@mail.com',
        password: 'password123',
        fullName: 'Test Name',
      };

      userRepo.findOne.mockResolvedValue({
        id: 1,
        email: 'test@mail.com',
        password: 'hashed',
        fullName: 'Test Name',
      } as unknown as User);

      exception.responseHelper.mockResolvedValue({
        status: 500,
        message: 'Email already exists',
      });

      const result = await service.store(dto);
      expect(result.status).toBe(500);
      expect(result.message).toBe('Email already exists');
    });

    it('should create a new user if email does not exist', async () => {
      const dto = {
        email: 'new@mail.com',
        password: 'password123',
        fullName: 'New User',
      };

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
  });

  describe('login', () => {
    it('should return error if email is not found', async () => {
      const dto = { email: 'notfound@mail.com', password: '123456' };

      userRepo.findOne.mockResolvedValue(null);
      exception.responseHelper.mockResolvedValue({
        status: 401,
        message: 'Email not found',
      });

      const result = await service.login(dto);
      expect(result.status).toBe(401);
      expect(result.message).toBe('Email not found');
    });

    it('should return error if password is incorrect', async () => {
      const dto = { email: 'test@mail.com', password: 'wrongPassword' };

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

      userRepo.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jwtService.sign.mockReturnValue('fake-jwt');
      exception.responseHelper.mockResolvedValue({
        status: 200,
        message: {
          jwt: { access_token: 'fake-jwt' },
          user: mockUser,
        },
      });

      const result = await service.login(dto);
      expect(result.status).toBe(200);
      expect(result.message.jwt.access_token).toBe('fake-jwt');
    });
  });
});