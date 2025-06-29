import { HttpExceptionStrategy } from './http-exception';
import { HttpStatus } from '@nestjs/common';

describe('HttpExceptionStrategy', () => {
  let strategy: HttpExceptionStrategy;

  beforeEach(() => {
    strategy = new HttpExceptionStrategy();
  });

  it('should return status 200 with message', async () => {
    const result = await strategy.responseHelper(200, 'OK');
    expect(result).toEqual({ status: HttpStatus.OK, message: 'OK' });
  });

  it('should return status 400 with message', async () => {
    const result = await strategy.responseHelper(400, 'Validation error');
    expect(result).toEqual({ status: HttpStatus.BAD_REQUEST, message: 'Validation error' });
  });

  it('should return status 401 with message', async () => {
    const result = await strategy.responseHelper(401, 'Unauthorized');
    expect(result).toEqual({ status: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' });
  });

  it('should return status 404 with message', async () => {
    const result = await strategy.responseHelper(404, 'Not found');
    expect(result).toEqual({ status: HttpStatus.NOT_FOUND, message: 'Not found' });
  });

  it('should return status 500 with message', async () => {
    const result = await strategy.responseHelper(500, 'Internal error');
    expect(result).toEqual({ status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Internal error' });
  });

  it('should return 500 if status is invalid', async () => {
    const result = await strategy.responseHelper(999, 'Unknown status');
    expect(result).toEqual({ status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Unknown status' });
  });
});