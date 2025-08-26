import { Router } from "express";
import {
  registerUser,
  logOutUser,
  loginUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  updateAccountDetails,
  updateUserCoverImage,
  updateUserAvatar,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();
//unsecured routes
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

//secured routes

router.route("/logout").post(verifyJWT, logOutUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/currentUser").get(verifyJWT, getCurrentUser);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("update-coverImage")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
