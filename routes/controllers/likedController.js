const { BasketItems, Basket, Item } = require("../../models/models");

class likedController {
    async getliked(req, res) {
        const { userid } = req.query;
        let ads = [];
        let elements = await Basket.findOne(
            {
                where: { id: userid },
                include: [{ model: BasketItems, as: "BasketItems" }]
            },
        )

        elements.BasketItems.forEach(element => {
            ads.push(element.dataValues.itemId);
        });

        let items = await Item.findAll({ where: { id: ads } })
        res.json(items);
    }

    async add(req, res) {
        const { id, userid } = req.query;

        await BasketItems.create({ itemId: id, BasketId: userid })
        return res.status(200).json({ message: "Added" });
    }

    async remove(req, res, next) {
        const { id } = req.query;
        let item = await BasketItems.destroy({ where: { itemId: id } });
        if (item) {
            return res.status(200).json({ message: "Deleted" });
        } else {
            return res.status(400).json({ message: "The item was not liked" });
        }
    }
}

module.exports = new likedController();