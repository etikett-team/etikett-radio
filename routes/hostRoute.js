const Route = require("express").Router();
const { getHostById, getHost, postHost, putHost, deleteHost } = require("../controllers/hostController");
const auth = require("../middleware/tokenAuthenticator");
const {isAdmin, isHostAdmin} = require("../middleware/rolesAuthenticator");

Route.get("/", auth, getHost);
Route.post("/post", auth, isHostAdmin, postHost); 
//Alternative syntax for practice purposes
Route.route("/:id")
    .get(auth, isHostAdmin, getHostById)
    .put(auth, isHostAdmin, putHost)
    .delete(auth, isAdmin, deleteHost);

module.exports = Route;