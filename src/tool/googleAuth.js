import GoogleStrategy from "passport-google-oauth20";
import { createAccessToken } from "../blog/jwtAuth.js";
import userModel from "../user/model.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.BE_URL}/googleRedirect`,
  },
  async (_, __, profile, passportNext) => {
    console.log("Profile: ", profile);
    const { email } = profile._json;

    try {
      const user = await userModel.findOne({ email });
      if (user) {
        const accessToken = await createAccessToken({
          email: profile._json.email,
        });

        passportNext(null, { accessToken });
      } else {
        const newUser = new userModel({
          firstName: profile._json.given_name,
          lastName: profile._json.family_name,
          email,
          googleId: profile.id,
        });
        const createdUser = await newUser.save();

        console.log(createdUser);

        const accessToken = await createAccessToken({
          email: profile._json.email,
        });
        passportNext(null, { accessToken });
      }
    } catch (error) {
      passportNext(error);
    }
  }
);

export default googleStrategy;
