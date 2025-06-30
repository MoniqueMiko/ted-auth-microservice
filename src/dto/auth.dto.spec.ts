import { validate } from 'class-validator';
import { CreateUserDto, LoginUserDto } from './auth.dto';

describe('CreateUserDto', () => {
  it('should be valid with all correct fields', async () => {
    const dto = new CreateUserDto();
    dto.email = 'user@email.com';
    dto.fullName = 'Maria Silva';
    dto.password = '123456';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if email is empty', async () => {
    const dto = new CreateUserDto();
    dto.email = '';
    dto.fullName = 'Maria Silva';
    dto.password = '123456';

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'email')).toBeTruthy();
  });

  it('should fail with invalid email', async () => {
    const dto = new CreateUserDto();
    dto.email = 'invalid_email';
    dto.fullName = 'Maria Silva';
    dto.password = '123456';

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'email')).toBeTruthy();
  });

  it('should fail with invalid fullName (numbers)', async () => {
    const dto = new CreateUserDto();
    dto.email = 'user@email.com';
    dto.fullName = 'Maria123';
    dto.password = '123456';

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'fullName')).toBeTruthy();
  });

  it('should fail if fullName is too long', async () => {
    const dto = new CreateUserDto();
    dto.email = 'user@email.com';
    dto.fullName = 'A'.repeat(51);
    dto.password = '123456';

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'fullName')).toBeTruthy();
  });

  it('should fail if password is too short', async () => {
    const dto = new CreateUserDto();
    dto.email = 'user@email.com';
    dto.fullName = 'Maria Silva';
    dto.password = '123';

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'password')).toBeTruthy();
  });

  it('should fail if password is too long', async () => {
    const dto = new CreateUserDto();
    dto.email = 'user@email.com';
    dto.fullName = 'Maria Silva';
    dto.password = 'a'.repeat(33);

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'password')).toBeTruthy();
  });
});

describe('LoginUserDto', () => {
  it('should be valid with correct email and password', async () => {
    const dto = new LoginUserDto();
    dto.email = 'login@email.com';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if email is missing', async () => {
    const dto = new LoginUserDto();
    dto.email = '';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'email')).toBeTruthy();
  });

  it('should fail with invalid email', async () => {
    const dto = new LoginUserDto();
    dto.email = 'invalid_email';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'email')).toBeTruthy();
  });

  it('should fail if password is too short', async () => {
    const dto = new LoginUserDto();
    dto.email = 'login@email.com';
    dto.password = '123';

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'password')).toBeTruthy();
  });

  it('should fail if password is missing', async () => {
    const dto = new LoginUserDto();
    dto.email = 'login@email.com';
    dto.password = '';

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'password')).toBeTruthy();
  });
});
