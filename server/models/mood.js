import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
  emoji: { type: String, required: true },
  note: String,
  subject: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Mood", moodSchema);