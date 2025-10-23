import jwt from "jsonwebtoken";
import User from "../models/User.js";

export function authOptional(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return next();
  const token = auth.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
  } catch(e) {
    // ignore invalid token
  }
  next();
}

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing authorization" });
  const token = auth.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireRole(requiredRoles = []) {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];
    const ok = requiredRoles.some(r => userRoles.includes(r));
    if (!ok) return res.status(403).json({ message: "Insufficient role" });
    next();
  };
}
