const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const keys = require('../config/keys');
const { usersdbpool } = require('../config/dbConfig');
const recordOperation = require('../services/recordOperation');


exports.login = async (req, res) => {
  const { username, password } = req.body;

  const options = { expiresIn: '12h' };

  try {
    const sql = `
      SELECT "ID", "username", "password" FROM "usersInfoTable"
      WHERE "username"='${username}'
    `;
    const result = await usersdbpool.query(sql);
    if (!result.rows) {
      return res.json({ error: 'username does not exists' });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ error: 'incorrect password' });
    }
    const payload = { user: { id: user.ID, username: user.username } };
    jwt.sign(payload, keys.JWT_SECRET, options, (error, token) => {
      return error ? res.json({ error: 'server error' }) : res.json({ token });
    });
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

exports.user = async (req, res) => {};
