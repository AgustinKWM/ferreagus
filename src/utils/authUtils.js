const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userData) => {
  return jwt.sign(
    {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      algorithm: 'HS256'
    }
  );
};

module.exports = {
  generateToken
};