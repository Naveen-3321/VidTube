import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from "../controllers/video.controller.js";

const router = Router();

router.route("/publish").post(
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishAVideo
);
router.route("/getVideo/:videoId").get(getVideoById);
router.route("/isPublished/:videoId").post(togglePublishStatus);
router
  .route("/videoUpdate/:videoId")
  .patch(upload.fields([{ name: "thumbnail", maxCount: 1 }]), updateVideo);
router.route("/deleteVideo/:videoId").delete(deleteVideo);

export default router;
