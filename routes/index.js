const Router = require("express");
const router = new Router();
const categoriesRouter = require("./categoriesRouter");
const locationsRouter = require("./locationsRouter");
const itemRouter = require("./itemRouter");
const likedRouter = require("./likedRouter");
const userRouter = require("./userRouter");
const adminRouter = require("./adminRouter");
 
router.use('/user', userRouter)
router.use('/categories', categoriesRouter)
router.use('/locations', locationsRouter)
router.use('/item', itemRouter)
router.use('/liked', likedRouter)
router.use('/admin', adminRouter)

module.exports = router;