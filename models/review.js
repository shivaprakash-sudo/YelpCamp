import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export default mongoose.model("Review", reviewSchema);