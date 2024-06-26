import userModel from "../models/userModel.js";

export const updateUserController = async (req, res, next) => {
  const { _id,nName, nEmail, nLastName,nLocation} = req.body;
  if (!nName || !nEmail || !nLastName || !nLocation) {
    next("Please Provide All Fields");
  }
  const user = await userModel.findOne({ _id: _id });
  user.name = nName;
  user.lastName = nLastName;
  user.email = nEmail;
  user.location = nLocation;
  const updatedUser = await userModel.findByIdAndUpdate(
    _id,
    {
      name: nName || user.name,
      lastName: nLastName || user.lastName,
      email: nEmail || user.email,
      location: nLocation || user.location,
    },
    { new: true }
  );
  await user.save();
  const token = user.createJWT();
  res.status(200).json({
    user,
    token,
    updatedUser
  });
};

// get user data
export const getUserController = async (req, res, next) => {
  try {
    const user = await userModel.findById({ _id: req.body.user.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "User Not Found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};
