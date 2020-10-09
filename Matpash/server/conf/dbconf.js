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
///create user matpash with encrypted password '1234';
//grant all privileges on database usersdb to matpash;
//grant all privileges on database maindb to matpash;

module.exports = {maindbpool,usersdbpool};