// signRoutes.js

const express = require('express');
const router = express.Router();
const postController = require('../controllers/userController');

router.get('/', signController.init);
router.get('/:login', signController.login);
router.post('/:signup', postController.signup);
router.put('/:profile', postController.updateProfile);


// Add other post-related routes as needed

module.exports = router;
