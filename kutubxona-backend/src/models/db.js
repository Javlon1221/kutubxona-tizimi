const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "kutubxonaDB",
    password: "2107"
})

pool.connect()
.then(() => console.log("baza ulandi"))
.catch(err => console.log("baza ulanmadi", err));

module.exports = pool;