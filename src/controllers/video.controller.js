import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynce_handeler.js";
import {
  deleteFromCloudinary,
  uploadonCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiRespons.js";
import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  //   const videoFile = req.files?.video?.[0];
  //   const thumbnailFile = req.files?.thumbnail?.[0];

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is not uploaded");
  }

  console.log("Video file received:", videoLocalPath);

  let video;

  try {
    video = await uploadonCloudinary(videoLocalPath);
    console.log("Uploaded video:", video);
  } catch (error) {
    throw new ApiError(500, "Failed to upload video");
  }
  let thumbnail;
  if (thumbnailLocalPath) {
    try {
      thumbnail = await uploadonCloudinary(thumbnailLocalPath);
      console.log("Uploaded thumbnail:", thumbnail);
    } catch (error) {
      console.log("Thumbnail upload failed, continuing without thumbnail");
    }
  }
  const uniqueVideoId = nanoid(10); // Generates a 10-character unique ID

  try {
    const videoDoc = await Video.create({
      title,
      description,
      duration: video?.duration || 0,
      videoFile: video.url,
      thumbnail: thumbnail?.url || "",
      owner: req.user?._id, // assumes auth middleware adds req.user\
      videoId: uniqueVideoId,
    });

    return res
      .status(201)
      .json(new ApiResponse(200, videoDoc, "Video uploaded successfully"));
  } catch (error) {
    console.log("Upload failed", error);
    if (video?.public_id) {
      await deleteFromCloudinary(video.public_id);
    }
    if (thumbnail?.public_id) {
      await deleteFromCloudinary(thumbnail.public_id);
    }
    throw new ApiError(500, "Something went wrong while uploading video");
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findOne({ videoId });
  if (!video) {
    throw new ApiError(400, "No Video");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, video, "Video found successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  const thumbnailFile = req.files.thumbnail[0]?.path;

  if (!videoId) {
    throw new ApiError(400, "VideoId is required");
  }

  if (!title && !description) {
    throw new ApiError(400, "Nothing to update");
  }

  const updatedData = {};

  if (title) updatedData.title = title;
  if (description) updatedData.description = description;

  if (thumbnailFile) {
    const thumbnail = await uploadonCloudinary(thumbnailFile);

    if (!thumbnail?.url) {
      console.error("Thumbnail upload failed:", thumbnail);
      throw new ApiError(400, "Failed to upload thumbnail");
    }

    updatedData.thumbnail = thumbnail.url;
  }

  const video = await Video.findOneAndUpdate(
    { videoId },
    { $set: updatedData },
    { new: true }
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "VideoId is required");
  }

  // Fetch video document
  const video = await Video.findOne({ videoId });

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Delete video file from Cloudinary
  if (video.videoFile) {
    try {
      const publicId = extractPublicId(video.videoFile);
      await deleteFromCloudinary(publicId);
    } catch (error) {
      console.warn("Failed to delete video file from Cloudinary:", error);
    }
  }

  // Delete thumbnail from Cloudinary (optional)
  if (video.thumbnail) {
    try {
      const publicId = extractPublicId(video.thumbnail);
      await deleteFromCloudinary(publicId);
    } catch (error) {
      console.warn("Failed to delete thumbnail from Cloudinary:", error);
    }
  }

  // Delete video document from DB
  await Video.deleteOne({ videoId });

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "Video and its details deleted successfully")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findOne({ videoId });
  if (!video) {
    throw new ApiError(400, "No Video");
  }
  video.isPublished = true;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Publish status updated successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
