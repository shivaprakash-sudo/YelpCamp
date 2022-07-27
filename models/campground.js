import mongoose from 'mongoose';
import Review from './review.js';

const Schema = mongoose.Schema;
const CampgroundSchema = new Schema(
    {
        title: String,

        price: Number,
        description: String,
        location: String,
        images: [
            {
                path: String,
                fileName: String
            }
        ],
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review"
            }
        ]
    }
);

CampgroundSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

export default mongoose.model("Campground", CampgroundSchema);