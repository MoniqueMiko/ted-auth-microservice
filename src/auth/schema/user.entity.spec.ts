import { User } from './user.entity';

describe('User Entity', () => {
  it('should create a valid user', () => {
    const user = new User();
    user.id = 1;
    user.email = 'user@email.com';
    user.password = 'securePassword123';
    user.fullName = 'Maria Silva';

    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.email).toBe('user@email.com');
    expect(user.password).toBe('securePassword123');
    expect(user.fullName).toBe('Maria Silva');
  });

  it('should allow creating two users with the same full name but different emails', () => {
    const user1 = new User();
    user1.email = 'email1@email.com';
    user1.password = 'password1';
    user1.fullName = 'Same Name';

    const user2 = new User();
    user2.email = 'email2@email.com';
    user2.password = 'password2';
    user2.fullName = 'Same Name';

    expect(user1.fullName).toBe(user2.fullName);
    expect(user1.email).not.toBe(user2.email);
  });

  it('should not allow two users with the same email (simulation)', () => {
    const user1 = new User();
    user1.email = 'duplicate@email.com';

    const user2 = new User();
    user2.email = 'duplicate@email.com';

    expect(user1.email).toBe(user2.email);
    const existingEmails = [user1.email];
    const isDuplicate = existingEmails.includes(user2.email);
    expect(isDuplicate).toBe(true);
  });
});