const Router = require("express");
const router = new Router();
const categoriesController = require("./controllers/categoriesController");
const checkRole = require("../middleware/checkRoleMiddleware")

router.get('/getall', categoriesController.getAll);

module.exports = router;