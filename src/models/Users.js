const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      match: [
        /^[a-zA-Zа-яА-Я0-9_.]+$/,
        "Username can only contain letters (Latin or Cyrillic), numbers, underscores, and dots",
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
      validate: {
        validator: function (value) {
          if (value.length > 254) return false;
          const domain = value.split("@")[1];
          if (domain && domain.length > 63) return false;
          return true;
        },
        message:
          "Email must be shorter than 254 characters and domain shorter than 63 characters",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
