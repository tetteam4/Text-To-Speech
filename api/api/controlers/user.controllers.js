import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import { io } from "../index.js"; // Import io from index.js

export const test = (req, res) => {
  res.json({ message: "API is working!" });
};

////////////////  Delete controler
export const updateUsers = async (req, res) => {
  const { username, email, password, profilePicture, activeForAudio } =
    req.body;
  const { id } = req.params;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const hashed = bcryptjs.hashSync(password, 10);
  // Check if the user exists in the User table
  let user = await User.findById(id);
  if (user) {
    // Update the User table
    user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          username,
          email,
          password: hashed,
          profilePicture,
          activeForAudio,
        },
      },
      { new: true }
    );
    const { password: pas, ...rest } = user._doc;
    return res.json(rest);
  } else {
    // User not found in either table
    return res.status(404).json({ message: "User not found" });
  }
};
export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "نمی توانید این حساب هذف نماید"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json(" حساث هدف شد ");
  } catch (error) {
    next(error);
  }
};

////////////////////sign out

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

/////// get user in admin dashboard

export const geteUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed see all user "));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: sortDirection });

    const usersWitgoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: {
        $gte: oneMonthAgo,
      },
    });

    res.status(200).json({
      users: usersWitgoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
export const getOnlineUsers = (req, res) => {
  try {
    // Get connected socket IDs, which are essentially the IDs of online users
    const onlineUsers = Array.from(io.sockets.sockets.keys());
    res.status(200).json(onlineUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const lastSeen = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    user.lastSeen = new Date();
    await user.save();

    res.status(200).json({ lastSeen: user.lastSeen });
  } catch (error) {
    next(error);
  }
};
