import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynce_handeler.js";

const verifyJWT = asyncHandler(async (req, _id, next) => {
  const token =
    req.cookies.accessToken ||
    req.header("Authorization"?.replace("Bearer", " "));

  if (!token) {
    throw new ApiError(401, "UnAuthorized");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password ");

    req.user = user;

    next();
    if (!user) {
      throw new ApiError(401, "UnAuthorized");
    }
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid AccessToken");
  }
});

export { verifyJWT };
