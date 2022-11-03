const { Categories } = require("../../models/models")
const ApiError = require('../../error/apierror');

class categoriesController {
    async getAll(req, res) {

        let allcategories = await Categories.findAll();
        if (!allcategories[0]) {
            let newCatList = await Categories.create();
            return res.json(newCatList);
        }
        return res.json(allcategories[0]);
    }
}

module.exports = new categoriesController();