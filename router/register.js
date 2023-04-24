const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerControllers");

router.post("/register", registerController.handleNewUser);

module.exports = router;