const fs = require("fs");
const pg = require("pg");
const url = require("url");

const config = {
  user: process.env.AIVEN_POSTGRES_USER,
  password: process.env.AIVEN_POSTGRES_PASSWORD,
  host: process.env.AIVEN_POSTGRES_HOST,
  port: process.env.AIVEN_POSTGRES_PORT,
  database: process.env.AIVEN_POSTGRES_DB,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.AIVEN_POSTGRES_CA,
  },
};

const client = new pg.Client(config);
client.connect(function (err) {
  if (err) throw err;
  client.query("SELECT VERSION()", [], function (err, result) {
    if (err) throw err;

    console.log(result.rows[0].version);
    client.end(function (err) {
      if (err) throw err;
    });
  });
});
