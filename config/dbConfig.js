const Pool = require("pg").Pool;

 const maindbpool = new Pool({
    user: "matpash",
    password: "1234",
    host: "localhost",
    port: 5432,
    database: "maindb",
    max: 3000,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

const dashboarddbpool = new Pool({
    user: 'matpash',
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: 'dashboarddb',
    max: 3000,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });



// use this details to connect into yout local db
 const usersdbpool = new Pool({
    user: "matpash",
    password: "1234",
    host: "localhost",
    port: 5432,
    database: "usersdb",
    max: 3000,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

module.exports = {maindbpool, usersdbpool, dashboarddbpool};