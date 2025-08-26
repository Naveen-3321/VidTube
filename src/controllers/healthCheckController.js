import { ApiResponse } from "../utils/apiRespons.js";
import { asyncHandler } from "../utils/asynce_handeler.js";

const healthCheck = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "OK", "Health Check Passes"));
});

export { healthCheck };
