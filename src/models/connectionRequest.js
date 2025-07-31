
const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    fromUserID:{
        type: mongoose.Types.ObjectId,
        required:true
    },
    toUserID:{
        type: mongoose.Types.ObjectId,
        required: true
    }
},{timestamps:true})


const ConnectionRequestModel = new mongoose.model("connectionRequests", connectionRequestSchema)

module.exports = ConnectionRequestModel;