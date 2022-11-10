import Express from "express";
import cors from "cors";
import Endpoint from "express-list-endpoints";
import blogRouter from "./blog/index.js";
import mongoose from "mongoose";
import passport from "passport";
import googleStrategy from "./tool/googleAuth.js";

// import dotenv from 'dotenv'
// dotenv.config()

const server = Express();
const port = process.env.PORT || 3001;

passport.use("google", googleStrategy);

server.use(cors());
server.use(Express.json());
server.use(passport.initialize());

server.use("/blog", blogRouter);

mongoose.connect(process.env.MONGO_CONNECTION_URL);

mongoose.connection.on("connected", () => {
  console.log("successfully connected to mongoDB");
  server.listen(port, () => {
    console.table(Endpoint(server));
    console.log(`server is running in ${port}`);
  });
});
