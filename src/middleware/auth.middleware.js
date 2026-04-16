const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ message: "Access token missing" });
    }

    const token = authHeader.split(" ")[1]; 

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token expired or invalid" });
      }

      req.user = decoded; 
      next();
    });

  } catch (err) {
    return res.status(500).json({ message: "Auth failed" });
  }
};
