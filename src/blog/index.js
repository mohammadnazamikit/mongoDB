import Express from "express";
import BlogsModel from "./model.js";
import createHttpError from "http-errors";
import commentsModel from "../comments/model.js";
import { basicAuthenticationMiddleware } from "./basicAuthentication.js";

const blogRouter = Express.Router();

blogRouter.post("/", basicAuthenticationMiddleware, async (req, res, next) => {
  try {
    const newUser = new BlogsModel(req.body);
    const { _id } = await newUser.save();

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/", async (req, res, next) => {
  try {
    const users = await BlogsModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});
blogRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await comm.findById(req.params.userId);
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `user with id ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
blogRouter.put("/:userId", async (req, res, next) => {
  try {
    const updateUser = await BlogsModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updateUser) {
      res.send(updateUser);
    } else {
      next(
        createHttpError(404, `user with id ${req.params.userId} didnt found`)
      );
    }
  } catch (error) {
    next(error);
  }
});
blogRouter.delete("/:userId", async (req, res, next) => {
  try {
    const deleteuser = await BlogsModel.findByIdAndDelete(req.params.userId);
    if (deleteuser) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `user with id ${req.params.userId} didnt found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

// **********************************************************Embedded Examples ******************************

blogRouter.post("/:blogPostId/comments", async (req, res, next) => {
  try {
    const blogPost = await BlogsModel.findById(req.params.blogPostId, {
      _id: 0,
    });
    if (blogPost) {
      const comment = req.body;
      //{data:'hello'}
      //... data:'hello'
      //{data:'hello'}
      const commentToInsert = {
        ...comment,
      };
      console.log(commentToInsert);

      const updateComment = await BlogsModel.findByIdAndUpdate(
        req.params.blogPostId,
        { $push: { comments: commentToInsert } },
        { new: true, runValidators: true }
      );
      if (updateComment) {
        res.send(updateComment);
      } else {
        next(
          createHttpError(
            404,
            `user with id ${req.params.blogPostId} not found`
          )
        );
      }
    } else {
      next(
        createHttpError(404, `use with id ${req.params.blogPostId} didnt found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:blogPostId/comments", async (req, res, next) => {
  try {
    const userComments = await BlogsModel.findById(req.params.blogPostId);
    if (userComments) {
      res.send(userComments.comments);
    } else {
      next(createHttpError(404, `user with id ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:blogPostId/comments/:commentId", async (req, res, next) => {
  try {
    const blogPostId = await BlogsModel.findById(req.params.blogPostId);
    console.log(blogPostId);
    if (blogPostId) {
      const comment = blogPostId.comments.find(
        (cmt) => cmt._id.toString() === req.params.commentId
      );
      console.log(comment);
      if (comment) {
        res.send(comment);
      } else {
        next(
          createHttpError(
            404,
            `the comment with id ${req.params.commentId} not found`
          )
        );
      }
    } else {
      next(createHttpError(404, `the user with Id ${req.params.commentId}`));
    }
  } catch (error) {
    next(createHttpError(404, `the user with id ${req.params.commentId}`));
  }
});

blogRouter.put("/:blogPostId/comments/:commentId", async (req, res, next) => {
  try {
    const blogPost = await BlogsModel.findById(req.params.blogPostId);
    if (blogPost) {
      const index = blogPost.comments.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      );

      if (index !== -1) {
        blogPost.comments[index] = {
          ...blogPost.comments[index].toObject(),
          ...req.body,
        };
        console.log(blogPost.comments);
        await blogPost.comments[index].save();
        res.send(blogPost);
      } else {
        next(
          createHttpError(404, `comment with ${req.params.commentId} not found`)
        );
      }
    } else {
      next(
        createHttpError(404, `the comment ${req.params.commentId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.delete(
  "/:blogPostId/comments/:commentId",
  async (req, res, next) => {
    try {
      const updateComment = await BlogsModel.findByIdAndUpdate(
        req.params.blogPostId,
        { $pull: { comments: { _id: req.params.commentId } } },
        { new: true }
      );
      if (updateComment) {
        res.send(updateComment);
      } else {
        next(
          createHttpError(
            404,
            `the comment with ${req.params.commentId} not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default blogRouter;
