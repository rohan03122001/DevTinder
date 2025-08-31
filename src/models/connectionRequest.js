const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "rejected", "accepted"],
        message: `{VALUE} is invalid status`,
      },
    },
  },
  { timestamps: true }
);
connectionRequestSchema.index({ fromUserID: 1, toUserID: 1 }, { unique: true });


connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserID.equals(connectionRequest.toUserID)) {
    throw new Error("Invalid UserID");
  }

  next();
});

const ConnectionRequestModel = new mongoose.model(
  "connectionRequests",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
