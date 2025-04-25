// src/router/Auth.js
const express = require('express');
const AuthController = require("../controller/Auth");

const router = express.Router();
// API Login
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

module.exports = router;
