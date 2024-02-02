const { generateToken } = require("../middlewares/jwtAuth");
const {
  comparePassword,
  Decrypt,
  hashPassword,
} = require("../middlewares/passwordencryption");

const User = require("../models/user.Schema");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const Password = Decrypt(password);
  const foundUser = await User.findOne({ email: email });
  if (!foundUser || foundUser?.disabled !== false) {
    return res.status(404).send({ message: "User does not exist" });
  }
  try {
    const compare = await comparePassword(Password, foundUser?.password);
    if (!compare) {
      return res.status(403).send({ message: "Invalid credential" });
    }
    const token = generateToken({
      id: foundUser?._id,
      email: foundUser?.email,
      role: foundUser?.role,
    });
    return res.status(200).send({ token: token });
  } catch (error) {
    console.log(error.toString());
    return res
      .status(500)
      .send({ message: "Something went wrong", error: error });
  }
};

const registerUser = async (req, res) => {
  const { name, username, email, password, age, gender } = await req.body;
  console.log(req.body);
  if (!name || !username || !email || !password || !age || !gender) {
    return res
      .status(406)
      .send({ message: "Please fill the all required details" });
  }
  if (!stringType) {
    return res.status(400).send({ message: "Please check the type of data" });
  }
  const emailExist = await User.find({ email: email });
  const usernameExist = await User.find({ username: username });
  if (usernameExist.length > 0 && emailExist > 0) {
    return res
      .status(400)
      .send({ message: "This email and username is already exist" });
  }
  if (usernameExist.length > 0) {
    return res
      .status(400)
      .send({ message: `Username '${username}' is already taken` });
  }
  if (emailExist.length > 0) {
    return res
      .status(400)
      .send({ message: `Email '${email}' is already taken` });
  }
  const decrryptedPassword = Decrypt(password);
  const hashedPassword = await hashPassword(decrryptedPassword);
  try {
    const user = new User({
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
      age: age,
      gender: gender,
    });
    await user.save();
    return res
      .status(201)
      .json({ message: `User '${user?.username}' saved successfully` });
  } catch (error) {
    console.log("register Error", error.toString());
    return res.status(500).json({ message: error });
  }
};

const getUserProfile = async (req, res, next) => {
  const { user } = req;
  try {
    const MyUser = await User.findById(user).select(
      "_id name username email age gender role "
    );
    if (!MyUser) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.status(200).send({ user: MyUser });
  } catch (error) {
    console.log(error.toString());
    return res.status(500).send({ message: error });
  }
};

const loginWithOtp = (req, res, next) => {};

const resetPassword = (req, res, next) => {};

module.exports = {
  loginUser,
  registerUser,
  getUserProfile,
  loginWithOtp,
  resetPassword,
};
