const {
  isValidEmail,
  isValidPassword,
  isValidObjectId,
} = require('../../utils/validators');
const generateToken = require('../../utils/generateToken');
const jwt = require('jsonwebtoken');

describe('Validators utility', () => {
  it('validates email correctly', () => {
    expect(isValidEmail('user@test.com')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('validates password length', () => {
    expect(isValidPassword('123456')).toBe(true);
    expect(isValidPassword('12345')).toBe(false);
  });

  it('validates ObjectId format', () => {
    expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
    expect(isValidObjectId('invalid')).toBe(false);
  });
});

describe('generateToken utility', () => {
  it('generates a valid JWT', () => {
    const token = generateToken('507f1f77bcf86cd799439011');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe('507f1f77bcf86cd799439011');
  });
});
