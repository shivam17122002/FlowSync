import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createVerificationToken,
  deleteExistingVerification,
  getValidVerification,
  buildVerificationLink,
  sendVerificationEmail
} from "../libs/verification-util.js";
import Verification from "../models/verification.js";
import { isSendGridConfigured } from "../libs/send-email.js";
import aj from "../libs/arcjet.js";

const isDevelopment = process.env.NODE_ENV !== "production";

const buildDevEmailResponse = (message, extra = {}) => ({
  message,
  ...extra,
  devMode: isDevelopment,
});

const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const decision = await aj.protect(req, { email });
    console.log("Arcjet decision", decision.isDenied());

    if (decision.isDenied()) {
      return res.status(403).json({ message: "Invalid email address" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email address already in use",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashPassword,
      name,
    });

    // Create verification token and send email
    await deleteExistingVerification(newUser._id);
    const { token: verificationToken } = await createVerificationToken(newUser._id, "email-verification", "1h");
    const verificationLink = buildVerificationLink(verificationToken, "verify-email");
    const emailSubject = "Verify your email";
    const devMsg = "Account created. Email delivery is disabled locally, so use the verification link from this response.";
    const devExtra = { verificationLink, verificationToken };
    const emailResult = await sendVerificationEmail(email, verificationLink, emailSubject, devMsg, devExtra);
    if (emailResult.dev) {
      return res.status(201).json(emailResult.response);
    }
    if (emailResult.error) {
      return res.status(500).json(emailResult.response);
    }
    res.status(201).json({
      message: "Verification email sent to your email. Please check and verify your account.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      const existingVerification = await getValidVerification(user._id);
      if (existingVerification) {
        return res.status(400).json({
          message: "Email not verified. Please check your email for the verification link.",
        });
      }
      await deleteExistingVerification(user._id);
      const { token: verificationToken } = await createVerificationToken(user._id, "email-verification", "1h");
      const verificationLink = buildVerificationLink(verificationToken, "verify-email");
      const emailSubject = "Verify your email";
      const devMsg = "Email verification is required. Email delivery is disabled locally, so use the verification link from this response.";
      const devExtra = { verificationLink, verificationToken };
      const emailResult = await sendVerificationEmail(email, verificationLink, emailSubject, devMsg, devExtra);
      if (emailResult.dev) {
        return res.status(200).json(emailResult.response);
      }
      if (emailResult.error) {
        return res.status(500).json(emailResult.response);
      }
      return res.status(201).json({
        message: "Verification email sent to your email. Please check and verify your account.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, purpose: "login" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.lastLogin = new Date();
    await user.save();

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, purpose } = payload;

    if (purpose !== "email-verification") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verification = await Verification.findOne({
      userId,
      token,
    });

    if (!verification) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isTokenExpired = verification.expiresAt < new Date();

    if (isTokenExpired) {
      return res.status(401).json({ message: "Token expired" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    user.isEmailVerified = true;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isEmailVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    const existingVerification = await getValidVerification(user._id);
    if (existingVerification) {
      return res.status(400).json({
        message: "Reset password request already sent",
      });
    }
    await deleteExistingVerification(user._id);
    const { token: resetPasswordToken } = await createVerificationToken(user._id, "reset-password", "15m");
    const resetPasswordLink = buildVerificationLink(resetPasswordToken, "reset-password");
    const emailSubject = "Reset your password";
    const devMsg = "Reset password email delivery is disabled locally, so use the reset link from this response.";
    const devExtra = { resetPasswordLink, resetPasswordToken };
    const emailResult = await sendVerificationEmail(email, resetPasswordLink, emailSubject, devMsg, devExtra);
    if (emailResult.dev) {
      return res.status(200).json(emailResult.response);
    }
    if (emailResult.error) {
      return res.status(500).json(emailResult.response);
    }
    res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, purpose } = payload;

    if (purpose !== "reset-password") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verification = await Verification.findOne({
      userId,
      token,
    });

    if (!verification) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isTokenExpired = verification.expiresAt < new Date();

    if (isTokenExpired) {
      return res.status(401).json({ message: "Token expired" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashPassword;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export {
  registerUser,
  loginUser,
  verifyEmail,
  resetPasswordRequest,
  verifyResetPasswordTokenAndResetPassword,
};
