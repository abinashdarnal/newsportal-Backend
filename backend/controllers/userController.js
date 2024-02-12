import expressAsyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import User from "../model/usermodel.js";
import jwt from "jsonwebtoken";

//@desc Register user
//@routes Get /api/user/register
//@access Private
const registerUser = expressAsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User Already registered this email address");
  }

  //hash password
  // const hashedPassword = await bcrypt.hash(password, 10);
  // console.log(`hashed Password: ${hashedPassword}`);
  const user = await User.create({
    username,
    email,
    password,
  });
  console.log(`User Created ${user}`);

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc login user
//@routes Post /api/user/login
//@access Private
const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All field are mandatory");
  }
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
  //compare password with hashedPassword
  // if (user && (await bcrypt.compare(password, user.password))) {
  //   // generateToken(res, user._id);

  //   const accessToken = jwt.sign(
  //     {
  //       user: {
  //         username: user.username,
  //         email: user.email,
  //         id: user.id,
  //       },
  //     },
  //     process.env.ACCESS_TOKEN_SECRET,
  //     {
  //       expiresIn: "20d",
  //     }
  //   );
  //   res.status(200).json({ accessToken });
  // } else {
  //   res.status(401);
  //   throw new Error(`Email or Password is not valid`);
  // }
  // res.json({ message: "Login the User" });
});

//@desc Logout user
//@routes post /api/user/Logout
//@access Public
const logoutUser = expressAsyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out" });
});

//@desc Profile user info
//@routes Get /api/user/profie
//@access Private
const getUserProfile = expressAsyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  };
  res.status(200).json(user);
});
//@desc Profile user info
//@routes Put /api/user/profie
//@access Private
const updateUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
  res.status(200).json(user);
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
