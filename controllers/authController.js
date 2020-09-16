const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const keys = require('../config/keys');
const { usersdbpool } = require('../config/dbConfig');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const sql = `
      SELECT "ID", "username", "password" FROM "usersInfoTable"
      WHERE "username"='${username}'
    `;
    const result = await usersdbpool.query(sql);

    if (!result.rows) {
      return res.status(400).json({ error: 'username does not exists' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'incorrect password' });
    }

    const accessToken = generateAccessToken(user);
    res.cookie('token', accessToken, { httpOnly: true });
    return res.json({ id: user.ID, username: user.username });
  } catch (error) {
    console.log(error);
  }
};

exports.registerUser = async (req, res) => {
  const {
    id,
    username,
    password,
    firstName,
    lastName,
    role,
    organiztion,
  } = req.body;

  try {
    const result = await usersdbpool.query(
      `SELECT "username" FROM "usersInfoTable" WHERE "username"='${username}'`
    );

    if (result.rows[0]) {
      return res.status(400).json({ error: 'username already exists' });
    }

    // Hash passwords before saving
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = `
    INSERT INTO "usersInfoTable" 
    ("ID", "username", "firstName", "lastName", "password", "role", "organization")
    VALUES ('${id}', '${username}', '${firstName}', '${lastName}', '${hashedPassword}', '${role}', '${organiztion}')
  `;

    await usersdbpool.query(sql);

    return res.send({});
  } catch (error) {
    return res.json({ error });
  }
};

exports.currentUser = async (req, res) => {
  return res.json(req.user);
};

function generateAccessToken(user) {
  const options = { expiresIn: '12h' };
  const payload = { user: { id: user.ID, username: user.username } };

  const accessToken = jwt.sign(payload, keys.JWT_SECRET, options);

  return accessToken;
}
