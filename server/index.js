require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const authCtrl = require("./controllers/authController");
const postCtrl = require("./controllers/postController");
const pokemonCtrl = require("./controllers/pokemonController");
const profileCtrl = require("./controllers/profileController");
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

// endpoints for auth
app.post("/api/auth/register", authCtrl.register);
app.post("/api/auth/login", authCtrl.login);
app.get("/api/auth/me", authCtrl.authMe);
app.post("/api/auth/logout", authCtrl.logout);

// change a user's profile pic
app.put(`/api/profile-pics`, profileCtrl.updatePic);

// endpoints for posts
app.get("/api/posts", postCtrl.getPosts);
app.post("/api/posts", postCtrl.addPost);

// pokemon endpoints
app.post("/api/pokemon", pokemonCtrl.addPokemon); // add a pokemon to a user's profile
app.get("/api/pokemon", pokemonCtrl.getTrainerPokemon); // get all of a user's pokemon
app.get("/api/trainers", pokemonCtrl.getProfilePic); // gets a user's profile pic to display on the page
app.delete("/api/pokemon", pokemonCtrl.releasePokemon); // deletes pokemon from a user's inventory
app.put("/api/pokemon", pokemonCtrl.renamePokemon); // back end stuff works. go make that axios stuff work

app.listen(SERVER_PORT, () => {
  console.log(`listening on port: ${SERVER_PORT}`);
});
