import mongoose from 'mongoose';
import Review from './review.js';

const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        path: String,
        fileName: String
    }
);

ImageSchema.virtual("thumbnail").get(function () {
    return this.path.replace("/upload", "/upload/w_200")
});

const CampgroundSchema = new Schema(
    {
        title: String,

        price: Number,
        description: String,
        location: String,
        images: [ImageSchema],
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
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