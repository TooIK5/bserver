const { Categories, Locations, Item } = require("../../models/models");
const ApiError = require("../../error/apierror");

class adminController {

    async getall(req, res, next) {
        try {
            let { limit, page, ispublished } = req.query;
            let items;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;
            items = await Item.findAndCountAll({ where: { published: ispublished }, limit, offset })
            return res.json(items)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async approve(req, res, next) {
        try {
            let { id } = req.query;
            await Item.update(
                { published: true },
                { where: { id } })
            return res.status(200).json({ id });
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async updatecategories(req, res, next) {
        try {
            let { id } = req.body;
            await Categories.update(
                { published: true },
                { where: { id } })
            return res.status(200).json({ message: "Approved" });
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new adminController();