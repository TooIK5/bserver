const Router = require("express");
const router = new Router();
const itemController = require("./controllers/itemController")
const authMiddleware = require("../middleware/authMiddleware")

router.post('/create', authMiddleware, itemController.create);
router.get('/getall', itemController.getAll);
router.get('/', itemController.search);
router.patch('/update', authMiddleware, itemController.update);
router.delete('/delete', authMiddleware, itemController.delete);
router.get('/one', itemController.getOne);

module.exports = router;