const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const keys = require('../config/keys');
const storeOperation = require('../services/storeOperation');
const UserService = require('../services/userService');
const { use } = require('passport');

const userService = new UserService();

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userService.findByUsername(username);

    if (!user) {
      return res.status(400).send('שם משתמש אינו קיים');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json('סיסמא שגויה');
    }

    const accessToken = generateAccessToken(user);
    res.cookie('token', accessToken, { httpOnly: true });

    await storeOperation({ type: 'login', username });

    return res.json({
      id: user.id,
      username: user.username,
      permissions: user.permissions,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.registerUser = async (req, res) => {
  const user = req.body;

  try {
    const usernameExists = await userService.findByUsername(user.username);

    if (usernameExists) {
      return res.status(400).json({ username: 'שם משתמש תפוס' });
    }

    const userIdExists = await userService.findById(user.id);

    if (userIdExists) {
      return res.status(400).json({ id: 'ת.ז בשימוש' });
    }

    // Hash passwords before saving
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    await userService.save(user);

    await storeOperation({ type: 'register', username: req.user.username });

    return res.send({});
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

exports.currentUser = async (req, res) => {
  return res.json(req.user);
};

exports.logout = async (req, res) => {
  res.clearCookie('token');
  return res.redirect('/');
};

function generateAccessToken(user) {
  const options = { expiresIn: '2h' };
  const payload = {
    user: {
      id: user.id,
      username: user.username,
      permissions: user.permissions,
    },
  };

  const accessToken = jwt.sign(payload, keys.JWT_SECRET, options);

  return accessToken;
}
