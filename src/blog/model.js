import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const commentsSchema = new Schema(
  {
    commentHeader: { type: String, required: true },
    commentText: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const blogschema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: String },
    },
    author: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    content: { type: String, required: true },
    comments: [commentsSchema],
  },
  {
    timestamps: true,
  }
);

blogschema.pre("save", async function (next) {
  const currentBlog = this;
  if (currentBlog.isModified("password")) {
    const plainPW = currentBlog.password;
    const hash = await bcrypt.hash(plainPW, 11);
    currentBlog.password = hash;
  }
  next();
});

blogschema.static("checkCredentials", async function (email, plainPassword) {
  const blog = await this.findOne({ email });
  if (blog) {
    const isMatch = await bcrypt.compare(plainPassword, blog.password);
    if (isMatch) {
      return blog;
    } else {
      return null;
    }
  } else {
    return null;
  }
});
export default model("Blog", blogschema);
