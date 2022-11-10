import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const usersSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
  },
  {
    timestamps: true,
  }
);

usersSchema.static("checkCredentials", async function (email, plainPassword) {
  const user = await this.findOne({ email });
  console.log(user, "user1");
  if (user) {
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (isMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
});

usersSchema.pre("save", async function (next) {
  const currentUser = this;
  if (currentUser.isModified("password")) {
    const plainPW = currentUser.password;

    const hash = await bcrypt.hash(plainPW, 10);
    currentUser.password = hash;
  }
  next();
});

export default model("user", usersSchema);
