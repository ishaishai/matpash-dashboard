const db = require('../db');

class UserService {
  async findUser(username) {
    const {
      rows,
    } = await db.query(
      'SELECT "ID", "username", "password" FROM "usersInfoTable" WHERE "username"= $1',
      [username]
    );

    return rows[0];
  }

  async getAll() {
    const { rows } = await db.query(`SELECT * FROM "usersInfoTable"`);

    return rows;
  }

  async save({
    id,
    username,
    firstName,
    lastName,
    password,
    role,
    organization,
  }) {
    await db.query(
      `INSERT INTO "usersInfoTable" 
      ("ID", "username", "firstName", "lastName", "password", "role", "organization")
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, username, firstName, lastName, password, role, organization]
    );
  }
}

module.exports = UserService;
