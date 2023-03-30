const Router = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();
const chatController = require("./controllers/chatController");

router.get('/get-messages', authMiddleware, chatController.getMessages);
router.post('/new-messages', authMiddleware, chatController.addMessages);
router.post('/new-chat', authMiddleware, chatController.addChat);
router.get('/getDialogs', authMiddleware, chatController.getDialogs);
router.post('/removeunreadebale', authMiddleware, chatController.removeUnreadebale);
router.get('/getunreadebale', authMiddleware, chatController.getUnreadebale);

module.exports = router;