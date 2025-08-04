require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"});
    return token;
}

module.exports = generateToken;