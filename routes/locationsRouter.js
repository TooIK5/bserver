const Router = require("express");
const router = new Router();
const locationsController = require("./controllers/locationsController")

router.get('/getall', locationsController.getAll)

module.exports = router;