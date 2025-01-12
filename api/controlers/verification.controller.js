import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const verifyEmail = async (req, res, next) => {
  const { token } = req.params;

  try {
    // Find the user with the matching token and valid expiry
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(errorHandler(400, "Invalid or expired verification token."));
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationToken = undefined; // clear the token
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    next(error);
  }
};
