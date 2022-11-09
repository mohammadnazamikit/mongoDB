import createHttpError from "http-errors";
import atob from "atob";
import blogModel from "./model.js";

export const basicAuthenticationMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createHttpError(404, `please add headers`));
  } else {
    const base64Credentials = req.headers.authorization.split(" ");
    const decodedCredentials = atob(base64Credentials);
    const [email, password] = decodedCredentials.split(":");
    const blog = await blogModel.checkCredentials(email, password);
    if (blog) {
      req.blog = blog;
      next();
    } else {
      next(createHttpError(404, `this is a error`));
    }
  }
};
