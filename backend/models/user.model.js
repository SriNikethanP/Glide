import mongoose from "mongoose";
import path from "path";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"],
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password is too short"],
    },
    profilePic: {
      type: String,
      default: function () {
        // Use the RoboHash API with the user's full name or _id
        return `https://robohash.org/${this._id}`;
      },
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    onlineStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
