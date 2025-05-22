import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protect = async (req, res, next) => {
  //   Check if the request has an authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Authentication failed: no token provided");
    error.statusCode = 401;
    return next(error);
  }

  let token = authHeader.split(" ")[1]; // Extract the token from the header

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key

    // Find the user by ID from the decoded token
    const user = await User.findById(decoded.userId).select("-password"); // Exclude the password field
    if (!user) {
      const error = new Error("Authentication failed: user not found");
      error.statusCode = 401;
      return next(error);
    }

    // Attach the user to the request object for further use
    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};

export default protect;
