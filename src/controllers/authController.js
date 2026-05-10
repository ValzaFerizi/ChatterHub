const { register, login } = require('../services/authService');

const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const result = await register(first_name, last_name, email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };