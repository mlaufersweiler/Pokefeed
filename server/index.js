require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");

const { CONNECTION_STRING, SESSION_SECRET, SERVER_PORT } = process.env;

const app = express();

app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

massive(CONNECTION_STRING)
  .then(db => {
    app.set("db", db);
    console.log("database connected [:");
  })
  .catch(err => {
    console.log("error connecting to db", err);
  });

app.listen(SERVER_PORT, () => {
  console.log(`listening on port: ${SERVER_PORT}`);
});
