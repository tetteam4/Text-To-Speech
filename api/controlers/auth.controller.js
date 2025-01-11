import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

const mySecretKety = "hussain";
// const mySecretKety="key that will sing in cookies"

export const signup = async (req, res, next) => {
  const { username, password, email } = req.body;
  if (
    !username ||
    !password ||
    !email ||
    username === "" ||
    password === "" ||
    email === ""
  ) {
    next(errorHandler(400, "همه فیلدها الزامی است"));
  }
  // 10 is roound maxer
  const hashedPassword = bcrypt.hashSync(password, 12);
  const newUser = new User({
    username: username,
    email: email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json({ message: "Sign up successful" });
  } catch (error) {
    next(error);
  }
};

/////////////////////////signIn route API
// why we use the asybnc method
export const singin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "همه فیلدها الزامی است"));
  }
  // check email and password
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "کاربر پیدا نشد"));
    }
    //plainText , hashed password
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(404, "رمز عبور درست نیست"));
    }

    // ues token for auth users
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser },
      mySecretKety,
      { expiresIn: "5d" }
    );
    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

/// google auth route handler controlers

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        mySecretKety,
        { expiresIn: "5d" }
      );
      const { password, ...rest } = user._doc;

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          // secure: true,
          // sameSite: 'none',
        })
        .json(rest);
    } else {
      /// if is not exist
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        mySecretKety,
        { expiresIn: "5d" }
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          // sameSite: 'none',
          // secure: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
