const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateAccessToken(id) {
  return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '30d' });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateAccessToken, verifyToken };
