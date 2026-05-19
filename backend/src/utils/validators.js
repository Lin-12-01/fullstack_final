const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

const isValidObjectId = (id) => {
  return /^[a-fA-F0-9]{24}$/.test(String(id));
};

const sanitizeString = (value, maxLength = 500) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidObjectId,
  sanitizeString,
};
