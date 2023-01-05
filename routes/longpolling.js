const Router = require("express");
const router = new Router();
const longPulling = require("./controllers/chatController")

router.get('/get-messages', longPulling.getMessages);
router.post('/new-messages', longPulling.addMessages);
router.post('/new-chat', longPulling.addChat);
router.get('/getDialogs', longPulling.getDialogs);

module.exports = router;