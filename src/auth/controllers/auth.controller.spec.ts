import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    store: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('store', () => {
    it('should call authService.store and return its result', async () => {
      const data = { username: 'test', password: '1234' };
      const result = { success: true };

      mockAuthService.store.mockResolvedValue(result);

      expect(await authController.store(data)).toBe(result);
      expect(mockAuthService.store).toHaveBeenCalledWith(data);
      expect(mockAuthService.store).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('should call authService.login and return its result', async () => {
      const data = { username: 'test', password: '1234' };
      const result = { token: 'abc123' };

      mockAuthService.login.mockResolvedValue(result);

      expect(await authController.login(data)).toBe(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(data);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    });
  });
});
