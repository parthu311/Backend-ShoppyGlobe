const jwt = require("jsonwebtoken");
require("dotenv").config();

// Secret key for JWT
const secret = process.env.JWT_SECRET; 

// Middleware to authenticate and validate the JWT token
const authenticate = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, secret);
    
    // Attach the user information from the decoded token to req.user
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authenticate };
