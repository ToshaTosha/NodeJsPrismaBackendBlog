import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      const decoded = jwt.verify(token, "secretkey");
      req.userId = decoded._id;
      console.log(req.userId);
      next();
    } catch (e) {
      return res.status(403).json({
        message: "Token is not valid!",
      });
    }
  } else {
    return res.status(403).json({
      message: "You are not authenticated!",
    });
  }
};
