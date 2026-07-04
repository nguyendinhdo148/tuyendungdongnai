import mongoose from "mongoose";

const saveJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ngăn người dùng lưu 1 job nhiều lần
saveJobSchema.index({ user: 1, job: 1 }, { unique: true });

export const SaveJob = mongoose.model("SaveJob", saveJobSchema);
