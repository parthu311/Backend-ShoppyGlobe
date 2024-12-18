const jwt = require("jsonwebtoken");

const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('hex'); // Generates a 256-bit secret
console.log('JWT Secret:', secret);
module.exports = secret;  


const authenticate = (req, res, next) => {
    const token = jwt.sign({ userId: 123 }, secret, { expiresIn: '1h' });
    console.log('Token:', token);
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authenticate };
