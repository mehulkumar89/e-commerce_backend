const User = require('../models/User');

const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');

module.exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(404);
    res.send('User already exists');
    throw new Error('User already exists');
  }

  //create a new user
  const Apidata=name+email
  const api_key = Buffer.from(Apidata).toString('base64')
  const user = await User.create({ name, email, password,api_key });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      api_key:user.api_key
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

module.exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check if the user exist in db
  const user = await User.findOne({ email });
  
  //validate password
  if (user && (await user.matchPassword(password))) {
    const userToken=generateToken(user._id)
    res.cookie("token",userToken,{
      httpOnly:true,
      secure:true,
      path:'/',
      sameSite:'none'
    })
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      api_key:user.api_key,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

module.exports.getUserProfile = asyncHandler(async (req, res) => {
  //re.user set up in middleware

  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
