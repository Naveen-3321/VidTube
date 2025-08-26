import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const commentSchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      required: "Video",
    },
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: "User",
    },
  },
  { timestamps: true }
);
videoSchema.plugin(mongooseAggregatePaginate);
export const Comment = mongoose.model("Comment", commentSchema);
