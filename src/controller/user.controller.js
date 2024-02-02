const { hashPassword, Decrypt } = require("../middlewares/passwordencryption");
const User = require("../models/user.Schema");
const mongoose = require("mongoose");
const isValid = mongoose.Types.ObjectId.isValid;

const getAllUsers = async (req, res) => {
  console.log(req.query);
  const { limit, sort, skip } = req?.query;
  const sorted = (await sort) === "dsc" ? { name: -1 } : { name: 1 };
  const totalRecordPerPage = parseInt(limit) || 10;
  try {
    const data = await User.find({ disabled: false })
      .select("_id name username email age gender")
      .skip(skip)
      .limit(totalRecordPerPage)
      .sort(sorted);

    if (data.length === 0) {
      return res.status(204).json({ message: "No content found" });
    } else {
      const limitlength =
        totalRecordPerPage < data.length ? totalRecordPerPage : data?.length;
      return res.status(200).send({
        users: data,
        filter: {
          limit: limitlength,
          skip: skip || 0,
        },
      });
    }
  } catch (error) {
    console.log(error.toString());
    return res.status(500).json({ message: error });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = await req?.params?.id;
    if (!isValid(id)) {
      return res.status(403).send({
        message: "Invalid id",
        error: `This '${id}' is not a valid id`,
      });
    }
    const data = await User.findById(id).select(
      "_id name username email age gender "
    );
    if (!data || data.length === 0) {
      return res.status(204).json({
        message: "User not exist",
        error: "Sorry this id does not exist in our database",
      });
    }
    return res.status(200).json({ user: data });
  } catch (error) {
    console.error(error.toString());
    return res
      .status(403)
      .send({ message: "Something went wrong", error: error });
  }
};

const updateSingleUser = async (req, res) => {
  const id =await req.params.id;
  const { name, username, email, age, gender } = await req.body;
  try {  
    if (!name || !username || !email || !age || !gender) {
      return res
        .status(406)
        .send({ message: "Please fill the all required details" });
    }
   

    const user = await User.findById(id);
    const emailExist = await User.findOne({ email: email });
    const usernameExist = await User.findOne({ username: username });
   
    if (
      usernameExist?.username !== undefined &&
      usernameExist?.username !== user?.username
    ) {
      return res
        .status(400)
        .send({ message: `Username '${username}' is already taken` });
    }
    if (
      emailExist?.username !== undefined &&
      emailExist?.email !== user?.email
    ) {
      return res
        .status(400)
        .send({ message: `Email '${email}' is already taken` });
    }

    await User.findByIdAndUpdate(id, {
      name: name,
      username: username,
      email: email,
      gender: gender,
      age: age,
    });
    return res
      .status(202)
      .send({ message: `User '${user?.username}' updated successfully` });
  } catch (error) {
    console.error(error.toString());
    return res.status(500).json({ message:"Something went wrong" , error: error });
  }
};
const deleteSingleUser = async (req, res) => {
  const id = req?.params?.id;
  
    if (!isValid(id)) {
      return res.status(403).send({ message: "Invalid Id" });
    }
  try {
    await User.findByIdAndDelete(id);
    return res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.log("deletesingleuser", error.toString());
    return res.status(500).send({ message:"Something went wrong",error:error });
  }
};

const disableSingleUser = async (req, res) => {
  try {
    const id = req?.params?.id;
    if (!isValid(id)) {
      return res.status(404).send({ message: "Not a valid id" });
    }
    const user = await User.findById(id);
    console.log("sdfsf", user);
    if (![user].length > 0 || user.disabled !== false) {
      return res.status(404).json({ message: "User not found" });
    } else {
      await User.updateOne({ _id: id }, { $set: { disabled: true } });
      return res.status(200).json({ message: "Update successfull" });
    }
  } catch (error) {
    console.error("disabledsingleUser", error.toString());
    return res.status(500).send({ message: "Something went wrong", error:error });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateSingleUser,
  disableSingleUser,
  deleteSingleUser,
};
