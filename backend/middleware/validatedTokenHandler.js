import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../model/usermodel.js";

const validatedToken = expressAsyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized, Invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized, no token");
  }
  // let authHeader = req.headers.Authorization || req.headers.authorization;
  // if (authHeader && authHeader.startsWith("Bearer")) {
  //   token = authHeader.split(" ")[1];
  //   jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
  //     if (err) {
  //       res.status(401);
  //       throw new Error("user is not Authorized");
  //     }
  //     req.user = decoded.user;
  //     next();
  //   });
  //   if (!token) {
  //     res.status(401);
  //     throw new Error(`User is not Authorized or token is missing`);
  //   }
  // }
});

export default validatedToken;
