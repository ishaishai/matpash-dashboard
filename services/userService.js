const { usersQuery } = require('../db');

class UserService {
  async findByUsername(username) {
    const {
      rows,
    } = await usersQuery(
      'SELECT "id", "username", "password" FROM public."usersInfoTable" WHERE "username"= $1',
      [username]
    );

    return rows[0];
  }

  async findById(id) {
    const {
      rows,
    } = await usersQuery(
      'SELECT "id", "username", "password" FROM public."usersInfoTable" WHERE "id"= $1',
      [id]
    );

    return rows[0];
  }

  async getAll() {
    const { rows } = await usersQuery(`SELECT * FROM public."usersInfoTable"`);

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
    permissions,
  }) {
    await usersQuery(
      `INSERT INTO public."usersInfoTable" 
      ("id", "username", "firstName", "lastName", "password", "role", "organization", "permissions")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        id,
        username,
        firstName,
        lastName,
        password,
        role,
        organization,
        permissions,
      ]
    );
  }
}

module.exports = UserService;
