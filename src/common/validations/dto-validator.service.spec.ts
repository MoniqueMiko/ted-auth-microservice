import { DtoValidatorService } from './dto-validator.service';
import { IsNotEmpty } from 'class-validator';

class MockHttpException {
  responseHelper = jest.fn((statusCode, message) => ({
    status: statusCode,
    message,
  }));
}

class DummyDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}

describe('DtoValidatorService', () => {
  let service: DtoValidatorService;
  let mockHttpException: MockHttpException;

  beforeEach(() => {
    mockHttpException = new MockHttpException();
    service = new DtoValidatorService(mockHttpException as any);
  });

  it('should return undefined if dto is valid', async () => {
    const data = { name: 'John Doe' };
    const result = await service.validateBody(DummyDto, data);

    expect(result).toBeUndefined();
    expect(mockHttpException.responseHelper).not.toHaveBeenCalled();
  });

  it('should return formatted error if dto is invalid', async () => {
    const data = { name: '' };
    const result: any = await service.validateBody(DummyDto, data);

    expect(mockHttpException.responseHelper).toHaveBeenCalled();
    expect(result.status).toBe(400);
    expect(result.message).toContain('Name is required');
  });

  it('should return undefined if dto is not provided', async () => {
    const result = await service.validateBody(null, { name: 'Test' });

    expect(result).toBeUndefined();
    expect(mockHttpException.responseHelper).not.toHaveBeenCalled();
  });
});