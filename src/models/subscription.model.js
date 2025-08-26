import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    channel: {
      type: Schema.Types.ObjectId,
      required: "User",
    },
    subscribers: {
      type: Schema.Types.ObjectId,
      required: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
