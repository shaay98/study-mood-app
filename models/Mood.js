import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
    emoji: String,
    note: String,
    subject: String,
    date: { type: Date, default: Date.now }
});

export default mongoose.model("Mood", moodSchema);
