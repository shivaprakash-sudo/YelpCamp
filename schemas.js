import Joi from "joi";

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})

export { campgroundSchema, reviewSchema };