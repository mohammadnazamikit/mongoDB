import mongoose from "mongoose";


const {Schema, model} = mongoose

const commentsSchema = new Schema(
    {
        commentHeader: {type: String, required: true},
        commentText : {type: String, required: true}
    },
    {
        timestamps : true
    }
)
export default model("comments", commentsSchema)