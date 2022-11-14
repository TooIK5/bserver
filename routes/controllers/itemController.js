const uuid = require("uuid");
const path = require("path");
const { Item } = require("../../models/models");
const ApiError = require("../../error/apierror");
const Op = require('Sequelize').Op;

const filemv = (img) => {
    let fileName = null;
    let fileNames = [];
    if (img === null) { return null }
    if (Array.isArray(img)) {
        for (let i = 0; i < img.length; i++) {
            fileName = uuid.v4() + ".jpg";
            img[i].mv(path.resolve(__dirname, "../../", "static", fileName));
            fileNames.push(fileName);
        }
    } else {
        fileName = uuid.v4() + ".jpg";
        img.mv(path.resolve(__dirname, "../../", "static", fileName));
        fileNames.push(fileName);
    }
    return fileNames;
}

class itemController {
    async create(req, res, next) {
        try {
            const { username, title, description, phone, price, userid, state, typeid, locationid } = req.body;
            const { img } = req.files;
            console.log(img)
            const item = await Item.create({ username, title, description, price, userid, phone, photo: filemv(img), state, typeid, locationid })
            return res.json(item);
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.query;
            const item = await Item.findOne({ where: { id } })
            return res.json(item);
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            var { typeid, locationid, limit, page, price, state } = req.query;
            let items;
            price = price.split(',');
            if (+state === 1) {
                state = [3, 2];
            }
            typeid = typeid.split(",");
            typeid = typeid.map(e => +e)

            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;
            items = await Item.findAndCountAll({ where: { typeid, published: true, locationid: +locationid === 1 ? { [Op.between]: [0, 100] } : locationid, price: { [Op.between]: price }, state }, limit, offset })
            return res.json(items)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async search(req, res) {
        let { title, locationid, limit, page } = req.query;
        page = page || 1;
        limit = limit || 10;
        let offset = page * limit - limit;
        let items = await Item.findAll({ where: { title, locationid, published: true }, limit, offset });
        return res.json(items);
    }

    async update(req, res, next) {
        try {
            const { title, description, price, id, state, typeid, locationid } = req.body;
            let names = undefined;

            if (req.files) {
                var { img } = req.files
                names = filemv(img);
            }

            const item = await Item.update(
                { title, description, price, photo: names, state, published: false, typeid, locationid },
                { where: { id } })
            return res.status(200).json({ message: "Updated" });
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res) {
        try {
            let { userid, id } = req.query;
            let item = await Item.destroy({ where: { userid, id } });
            if (item) {
                return res.status(200).json({ message: "Deleted" });
            } else {
                return res.status(400).json({ message: "The item not exist" });
            }
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new itemController();