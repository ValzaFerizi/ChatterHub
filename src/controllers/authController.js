const { register, login, refreshAccessToken } = require('../services/authService');

const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const ipAddress = req.ip;
    const result = await register(first_name, last_name, email, password, ipAddress);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    const result = await login(email, password, ipAddress);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = refreshAccessToken(refreshToken);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, refreshToken };