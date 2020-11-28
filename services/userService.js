const { usersQuery, DashboardDBpool } = require('../db');

class UserService {
  async findByUsername(username) {
    const {
      rows,
    } = await usersQuery(
      `SELECT "username", "password", "permissions" FROM public."usersInfoTable" WHERE "username"= $1`,
      [username],
    );

    return rows[0];
  }

  async getAll() {
    const { rows } = await usersQuery(`SELECT * FROM public."usersInfoTable"`);

    return rows;
  }

  async userPriviliedgesCreate(user) {
    await usersQuery(`INSERT INTO public."usersPriviledgesTable"(
      username, print, pdf, image)
      VALUES ('${user.username}', false, false, false);`);
  }

  async save({
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
      ("username", "firstName", "lastName", "password", "role", "organization","permissions")
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        username,
        firstName,
        lastName,
        password,
        role,
        organization,
        permissions,
      ],
    );

    //insert into users priviledges also
    await usersQuery(`INSERT INTO public."usersPriviledgesTable"(
      username, print, pdf, image)
      VALUES ('${username}', false, false, false);`);

    //insert into dashboard priviledges also
    await DashboardDBpool.query(`INSERT INTO public."dashboardPriviledgesTable"(
      "username")
      VALUES ('${username}'); `);
  }

  async getPermissions() {
    const { rows } = await usersQuery(
      `SELECT "username","firstName","lastName","print", "pdf", "image"
	    FROM public."usersPriviledgesTable" join public."usersInfoTable" using(username);`,
    );
    return rows;
  }
}

module.exports = UserService;
