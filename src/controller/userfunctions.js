const { hashPassword, Decrypt } = require("../middlewares/passwordencryption");
const User = require("../models/userSchema");
const mongoose = require("mongoose");
const isValid = mongoose.Types.ObjectId.isValid;

const getAllUsers = async (req, res) => {
  console.log(req.query)
  const { limit, sort, skip } = req.query;
  const sorted = (await sort) === "dsc" ? { name: -1 } : { name: 1 };
  const totalRecordPerPage = parseInt(limit) || 10;
  try {
    const data = await User.find({ disabled: false })
      .select("_id name username email age gender")
      .limit(totalRecordPerPage)
      .skip(skip)
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
    return res.status(500).json({message:error});
  }
};

const getUserById = async (req, res) => {
  const id = await req?.params?.id;
  if (!isValid(id)) {
    return res.status(403).json({ message: `This '${id}' is not a valid id` });
  }
  try {
    const data = await User.findById(id).select(
      "_id name username email age gender "
    );
    if (!data) {
      return res
        .status(204)
        .json({ message: "Sorry this id does not exist in our database" });
    }
    return res.status(200).json({user: data });
  } catch (error) {
   console.error(error.toString());
    return res.status(404).send({message:error});
  }
};




const updateSingleUser = async (req, res) => {
  const id = req.params.id;
  const { name, username, email, age, gender } = await req.body;
  if (!name || !username || !email || !age || !gender) {
    return res.status(406).send({message:"Please fill the all required details"});
  }
  const stringType = [name, username, email, gender, age].every(
    (val) => typeof val == "string"
  );
  if (!stringType) {
    return res.status(400).send({message:"Please check the type of data"});
  }

  const user = await User.findById(id);
  const emailExist = await User.findOne({ email: email });
  const usernameExist = await User.findOne({ username: username });
  console.log(user?.username, usernameExist, user?.email, emailExist?.email);
  console.log(
    usernameExist !== undefined,
    usernameExist?.username !== user?.username
  );

  if (
    usernameExist?.username !== undefined &&
    usernameExist?.username !== user?.username
  ) {
    return res.status(400).send({message:`Username '${username}' is already taken`});
  }
  if (emailExist?.username !== undefined && emailExist?.email !== user?.email) {
    return res.status(400).send({message:`Email '${email}' is already taken`});
  }

  try {
    await User.findByIdAndUpdate(id, {
      name: name,
      username: username,
      email: email,
      gender: gender,
      age: age,
    });
    return res
      .status(201)
      .json({ message: `User '${user?.username}' updated successfully` });
  } catch (error) {
    console.log(error.toString());
    return res.status(500).json({ message: error});
  }
};
const deleteSingleUser = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  if (!isValid(id)) {
    return res.status(403).send({message:"Invalid Id"});
  }

  try {
    await User.findByIdAndDelete(id);
    return res.status(200).send({message:"User deleted successfully"});
  } catch (error) {
    console.log("deletesingleuser",error.toString());
    return res.status(500).send({message:error});
  }
};

const disableSingleUser = async (req, res) => {
  const id = req?.params?.id;
  if (!isValid(id)) {
    return res.status(404).send({message:"Not a valid id"});
  }
  try {
    const user = await User.findById(id);
    console.log("sdfsf", user);
    if (![user].length > 0 || user.disabled !== false) {
      return res.status(404).json({ message: "User not found" });
    } else {
      await User.updateOne({ _id: id }, { $set: { disabled: true } });
      return res.status(200).json({ message: "Update successfull" });
    }
  } catch (error) {
    console.log("disabledsingleUser",error.toString());
    return res.status(500).send({ message: error });
  }
};



module.exports = {
  getAllUsers,
  getUserById,
  updateSingleUser,
  disableSingleUser,
  deleteSingleUser,
};
