//THIS JOI IS USED TO VALIDATE ANY SCHEMA THAT IS DEFINED HERE->IT IS USEFUL WHEN A CLIENT IS SENDING A POST REQUEST WITHOUT PROPER FIELDS
const Joi=require("joi");

module.exports.listingschema=Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
    }).required()

});

//REVIEW SCHEMA FOR SERVER SIDE VALIDATION
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating :Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required(),
});