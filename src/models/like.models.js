import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      required: "Video",
    },
    comment: {
      type: Schema.Types.ObjectId,
      required: "Comment",
    },
    tweet: {
      type: Schema.Types.ObjectId,
      required: "Tweet",
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      required: "User",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);
