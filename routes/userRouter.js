const Router = require("express");
const userController = require("./controllers/userController");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware")

router.post('/registration', userController.registration);
router.get('/login', userController.login);
router.get('/auth', userController.check);
router.get('/getmyads', authMiddleware, userController.getmyads);
router.put('/update', authMiddleware, userController.update);

module.exports = router; 