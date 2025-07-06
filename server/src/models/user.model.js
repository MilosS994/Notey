import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minLength: [2, "Username must be at least 2 characters long"],
      maxLength: [55, "Username can't be more than 55 characters long"],
      required: [true, "Username is required"],
      unique: [true, "Username already taken"],
    },

    email: {
      type: String,
      lowercase: true,
      required: [true, "Email is required"],
      unique: [true, "User already exists"],
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters long"],
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create notes virtual field with each user's notes
userSchema.virtual("notes", {
  ref: "Note",
  localField: "_id",
  foreignField: "author",
});
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

// Hash password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(`Error comparing password: ${error.message}`);
  }
};

const User = mongoose.model("User", userSchema);

export default User;
