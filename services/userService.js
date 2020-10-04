const { usersQuery, DashboardDBpool } = require('../db');

class UserService {
  async findByUsername(username) {
    console.log('AFASFASF');
    const {
      rows,
    } = await usersQuery(
      `SELECT "id", "username", "password", "permissions" FROM public."usersInfoTable" WHERE "username"= $1`,
      [username],
    );

    return rows[0];
  }

  async findById(id) {
    const {
      rows,
    } = await usersQuery(
      'SELECT "id", "username", "password" ,"permissions" FROM public."usersInfoTable" WHERE "id"= $1',
      [id],
    );

    return rows[0];
  }

  async getAll() {
    const { rows } = await usersQuery(`SELECT * FROM public."usersInfoTable"`);

    return rows;
  }

  async userPriviliedgesCreate(user) {
    console.log(`INSERT INTO public."usersPriviledgesTable"(
      id, admin, view, edit, print, pdf, image, csv, xlsx, "dataTable")
      VALUES ('${user.userid}', ${
      user.permission == 'מנהל' ? true : false
    }, true, ${
      user.permission == 'מנהל'
        ? true
        : user.permission == 'עורך'
        ? true
        : false
    }, false, false, false, false, false, false);`);
    await usersQuery(`INSERT INTO public."usersPriviledgesTable"(
      id, admin, view, edit, print, pdf, image, csv, xlsx, "dataTable")
      VALUES ('${user.userid}', ${
      user.permission == 'מנהל' ? true : false
    }, true, ${
      user.permission == 'מנהל'
        ? true
        : user.permission == 'עורך'
        ? true
        : false
    }, false, false, false, false, false, false);`);
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
      ("id", "username", "firstName", "lastName", "password", "role", "organization","permissions")
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

    //insert into users priviledges also
    await usersQuery(`INSERT INTO public."usersPriviledgesTable"(
      id, admin, view, edit, print, pdf, image, csv, xlsx, "dataTable")
      VALUES ('${id}', ${permissions == 'מנהל' ? true : false}, true, ${
      permissions == 'מנהל' ? true : permissions == 'עורך' ? true : false
    }, false, false, false, false, false, false);`);

    //insert into dashboard priviledges also
    await DashboardDBpool.query(`INSERT INTO public."dashboardPriviledgesTable"(
      "userId")
      VALUES ('${id}'); `);
  }

  async getPermissions() {
    const { rows } = await usersQuery(
      `SELECT "id","username","firstName","lastName","admin", "view", "edit", "print", "pdf", "image", "csv", "xlsx", "dataTable"
	    FROM public."usersPriviledgesTable" join public."usersInfoTable" using(id);`
    );
    return rows;
  }
}

module.exports = UserService;
