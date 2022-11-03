const Router = require("express");
const router = new Router();
const adminController = require("./controllers/adminController");
const checkRole = require("../middleware/checkRoleMiddleware")

router.get('/getall', checkRole("ADMIN"), adminController.getall);
router.patch('/approve', checkRole("ADMIN"), adminController.approve);

module.exports = router;