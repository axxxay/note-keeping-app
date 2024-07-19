const userService = require('../service/userService');

const registerUser = async (req, res) => {
  try {
        const result = await userService.registerUser(req.body);
        res.status(201).json(result);
  } catch (e) {
        console.log(e);
        res.status(e.statusCode || 500).json({ error: e.message });
  }
};

const loginUser = async (req, res) => {
    try {
        const result = await userService.loginUser(req.body);
        res.status(200).json(result);
    } catch (e) {
        console.log(e);
        res.status(e.statusCode || 500).json({ error: e.message });
    }
};

module.exports = { registerUser, loginUser };