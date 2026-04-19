const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect()
  .then(() => {
    console.log("CONNECTED");
    return client.end();
  })
  .catch(err => {
    console.error("ERROR:", err);
  });