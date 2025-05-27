import mongoose from "mongoose";
import User from "../schemas/UserSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Exercise from "../schemas/ExerciseSchema.js";
import Workout from "../schemas/WorkoutSchema.js";
import WorkoutSession from "../schemas/WorkoutSessionSchema.js";

const userModel = {
  loginUser: async function (req, res) {
    try {
      await mongoose.connect(process.env.DBURI);
      console.log("Connected to MongoDB with Mongoose");
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Return user info (without password) and token
      const userToReturn = user.toObject();
      delete userToReturn.password;

      res.status(200).json({
        token,
        user: userToReturn,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createUser: async function (req, res) {
    try {
      await mongoose.connect(process.env.DBURI);
      console.log("Connected to MongoDB with Mongoose");
      const { email, password, firstName, lastName, avatar } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }],
      });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const newUser = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        avatar,
      });

      await newUser.save();

      const userToReturn = newUser.toObject();
      delete userToReturn.password;

      res.status(201).json(userToReturn);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getUserProfile: async function (req, res) {
    try {
      await mongoose.connect(process.env.DBURI);
      console.log("Connected to MongoDB with Mongoose");
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateUserProfile: async function (req, res) {
    try {
      await mongoose.connect(process.env.DBURI);
      console.log("Connected to MongoDB with Mongoose");
      const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true,
      }).select("-password");
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteUserProfile: async function (req, res) {
    try {
      // Delete the user
      const deletedUser = await User.findByIdAndDelete(req.user.id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Delete all exercises created by the user
      await Exercise.deleteMany({ createdBy: req.user.id });

      // Delete all workouts created by the user
      await Workout.deleteMany({ createdBy: req.user.id });

      // Delete all workout sessions for the user
      await WorkoutSession.deleteMany({ userId: req.user.id });

      res.status(200).json({ message: "User and all related data deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default userModel;
