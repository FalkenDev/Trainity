import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info to request
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token is not valid" });
  }
}
