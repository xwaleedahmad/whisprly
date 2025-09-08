import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import { CLIENT_URL } from "../config/config.js";

export const signup = async (req, res) => {
  try {
    const { email, userName, fullName, password, confirmPassword, gender } =
      req.body;
    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords do not match" });
    }
    const checkUserExists = await userModel.findOne({ email });
    if (checkUserExists) {
      return res
        .status(400)
        .json({ error: "A user with this email already exists." });
    }
    const checkUniqueUsername = await userModel.findOne({ userName });
    if (checkUniqueUsername) {
      return res.status(400).json({ error: "Username must be unique" });
    }

    const profilePicInitials = `https://api.dicebear.com/9.x/bottts/svg?seed=${userName}&radius=50&backgroundColor=c0aede`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      email,
      userName,
      fullName,
      password: hashedPassword,
      gender,
      profilePic: profilePicInitials,
    });

    if (newUser) {
      const { token } = generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(200).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        profilePic: newUser.profilePic,
        email: newUser.email,
        message: "Account Created Successfully",
        token,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error occurred while Signup", error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!isPasswordCorrect || !user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    if (isPasswordCorrect) {
      const { token } = generateTokenAndSetCookie(user._id, res);
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        userName: user.userName,
        profilePic: user.profilePic,
        email: user.email,
        message: "Login successful",
        token,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error occurred while login", error.message);
  }
};

export const logout = (req, res) => {
  try {
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error occurred while logout", error.message);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Password Reset link has expired! Request a new one",
        });
      }
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = await userModel.findOne({ email: decoded?.email });

    if (!user) {
      return res.status(404).json({ error: "Account Not Found" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password & Confirm Password don't match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await userModel.findOneAndUpdate(user, {
      password: hashedPassword,
    });

    res.status(200).json({ message: "Password Updated Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error occurred while resetting Password", error.message);
  }
};

export const sendEmail = async (req, res) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { email } = req.body;
    const checkUserExists = await userModel.findOne({ email });

    if (!checkUserExists) {
      return res
        .status(400)
        .json({ error: "Email not associated with any account" });
    }

    const token = jwt.sign({ email }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });

    const resetUrl = `${CLIENT_URL}/reset-password/${token}`;

    const emailTemplate = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset Request</title>
                    <style>
                        html,body {
                            width:100%;
                            height:100%;
                            font-family: Arial, sans-serif;
                            color: rgb(241, 241, 241);
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: rgb(29, 29, 29);
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            color: rgb(241, 241, 241);

                        }
                        .header {
                            background: linear-gradient(to right,#863ffa,#3ec0fc);
                            padding: 6px;
                            text-align: center;
                            color: #ffffff;
                        }
                        .content {
                            padding: 20px;
                            color: rgb(241, 241, 241);
                        }
                        .content h1 {
                            color: #863ffa;
                        }
                        .content p {
                            line-height: 1.6;
                        }
                        .button {
                            display: inline-block;
                            margin-top: 20px;
                            padding: 10px 20px;
                            background-color: #863ffa;
                            border-radius: 5px;
                            transition: background-color 0.3s ease;
                            color: #ffffff !important;
                            text-decoration: none !important;
                        }
                        .button:hover {
                            background-color: #5e26b7;

                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Whisprly</h1>
                        </div>
                        <div class="content">
                            <h1>Password Reset Request</h1>
                            <p>We received a request to reset your password. Click the button below to reset it. This link will expire in 1 hour.</p>
                            <a href="${resetUrl}" class="button" style="color: #ffffff !important; text-decoration: none !important;">Reset Password</a>
                            <p>If you didn't request a password reset, please ignore this email.</p>
                        </div>
                    </div>
                </body>
                </html>`;

    const { error } = await resend.emails.send({
      from: "Whisprly <noreply@waleedahmad.online>",
      to: [email],
      subject: "Password Reset Request",
      html: emailTemplate,
    });

    if (error) {
      console.log(error);
      return res.status(400).json({ error });
    }

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error occurred while sending Email", error.message);
  }
};
