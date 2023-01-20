// Conventions to follow
// keep the seed data in data folder
// keep the file name as the table name for that data and keep it in json file
// always include id as well for the data to be inserted
// here just change the table name to your new table name and run the yarn seed-local

const users = require("./data/users.json");
const knex = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

const insertData = function () {
  return knex("users")
    .del()
    .then(() => knex("users").insert(users));
};

insertData()
  .then(function () {
    console.log("Data Insertion Complete");
  })
  .then(function () {
    process.exit(0);
  })
  .catch(function (error) {
    console.log(error);
  });
