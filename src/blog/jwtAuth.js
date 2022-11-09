import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      createHttpError(
        401,
        "please provide bearer token in the authorization header"
      )
    );
  } else {
    try {
      const accessToken = req.headers.authorization.replace("Bearer ", "");

      console.log(accessToken);

      const payload = await verifyAccessToken(accessToken);

      req.user = {
        _id: payload._id,
      };
      next();
    } catch (error) {
      next(createHttpError(401, "Token not Valid"));
    }
  }
};

export const createAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
};

export const verifyAccessToken = (accessToken) =>
  new Promise((res, rej) =>
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, originalPayload) => {
      if (err) {
        rej(err);
      } else res(originalPayload);
    })
  );
