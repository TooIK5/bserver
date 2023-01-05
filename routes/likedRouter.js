const Router = require("express");
const router = new Router();
const likedController = require("./controllers/likedController.js")
const authMiddleware = require("../middleware/authMiddleware")

router.post('/add', authMiddleware, likedController.add);
router.get('/getliked', authMiddleware, likedController.getliked);
router.delete('/remove', authMiddleware, likedController.remove);

module.exports = router;