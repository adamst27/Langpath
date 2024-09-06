import { Schema, model, models } from "mongoose";

const sessionSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  expires_at: {
    type: Date,
    required: true,
  },
});

export const Session = models.Session || model("Session", sessionSchema);
