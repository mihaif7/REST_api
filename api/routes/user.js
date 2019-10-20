const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/user');

router.post('/signup', UserController.user_create);

router.post("/login", UserController.user_login);

router.delete('/:userId', checkAuth,UserController.uesr_delete);

module.exports = router;