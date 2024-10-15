import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
  const { name, email, password, lastName } = req.body;
  //validate
  if (!name) {
    return res.status(404).send({
      success: false,
      message: "Please enter your name",
    });
  }
  if (!lastName) {
    return res.status(404).send({
      success: false,
      message: "Please enter your surname",
    });
  }
  if (!email) {
    return res.status(404).send({
      success: false,
      message: "Please enter email",
    });
  }
  if (!password) {
    return res.status(404).send({
      success: false,
      message: "Please enter password",
    });
  }
  const exisitingUser = await userModel.findOne({ email });
  if (exisitingUser) {
    return res.status(404).send({
      success: false,
      message: "You have already registered",
    });
  }
  const user = await userModel.create({ name, email, password, lastName });
  //token
  const token = user.createJWT();
  res.status(201).send({
    success: true,
    message: "User Created Successfully",
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
    },
    token,
  });
};

export const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  //validation
  if (!email || !password) {
     
    return res.status(404).send({
      success: false,
      message: "Invalid email or password",
    });
  }
  //check user
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "Email is not registerd",
    });
  }
  const match = await user.comparePassword(password);
  if (!match) {
    return res.status(400).send({
      success: false,
      message: "Invalid Password",
    });
  }
  user.password = undefined;
  const token = user.createJWT();
  res.status(200).json({
    success: true,
    message: "Login Successfully",
    user,
    token,
  });
};
