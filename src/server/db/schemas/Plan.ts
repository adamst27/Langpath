import { Schema, models, model } from "mongoose";
import { boolean } from "zod";

const planSchema = new Schema({
  language: { type: String, required: true },
  flag: { type: String, required: true },
  isDone: { type: Boolean, default: false },
  steps: [
    {
      title: { type: String, required: true },
      substeps: [
        {
          title: { type: String, required: true },
          details: [{ type: String }],
          isDone: { type: Boolean, default: false },
        },
      ],
      importantNote: { type: String },
      isDone: { type: Boolean, default: false },
    },
  ],
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Plan = models.Plan || model("Plan", planSchema);
