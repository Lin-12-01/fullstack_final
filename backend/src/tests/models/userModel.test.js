const User = require('../../models/User');

describe('User Model', () => {
  it('should require name, email and passwordHash', async () => {
    const user = new User({});
    let err;
    try {
      await user.validate();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.passwordHash).toBeDefined();
  });

  it('should create a valid user', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'password123',
    });
    expect(user._id).toBeDefined();
    expect(user.email).toBe('test@example.com');
    expect(user.role).toBe('user');
    expect(user.isOnline).toBe(false);
  });

  it('should not expose passwordHash in toJSON', async () => {
    const user = await User.create({
      name: 'JSON User',
      email: 'json@example.com',
      passwordHash: 'password123',
    });
    const json = user.toJSON();
    expect(json.passwordHash).toBeUndefined();
  });
});
