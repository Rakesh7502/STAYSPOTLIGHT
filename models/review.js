const mongoose=require("mongoose");
const Schema=mongoose.Schema;
// const mongoose=require("mongoose");
// const Schema=mongoose.Schema;
const reviewSchema= new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type: Date,
        default:Date.now(),
    },
    //creating author for authorization purpose
    author : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
});
const reviewSchema1=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    Ownned = String,
    author : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
});
module.exports=mongoose.model("Review",reviewSchema);
