import Joi from "joi";

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})

export { campgroundSchema, reviewSchema };