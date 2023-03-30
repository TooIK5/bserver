const uuid = require("uuid");
const path = require("path");
const { Item } = require("../../models/models");
const ApiError = require("../../error/apierror");
const Op = require('sequelize').Op;
const sequelize = require('sequelize');
const fs = require('fs');
const { compress } = require('compress-images/promise');
let INPUT_path_to_your_images;
let OUTPUT_path;

INPUT_path_to_your_images = path.resolve(__dirname, "../../", "static/precompressed/*.{jpg,JPG,jpeg,JPEG,png}");
OUTPUT_path = path.join(__dirname, "../../", "static/");

const processImages = async (files) => {
    const result = await compress({
        source: INPUT_path_to_your_images,
        destination: OUTPUT_path,
        enginesSetup: {
            jpg: { engine: 'mozjpeg', command: ['-quality', '60']},
            png: { engine: 'pngquant', command: ['--quality=20-50', '-o']},
        }
    }).then((stat)=> {
        files.forEach(element => {
            fs.unlink(path.resolve(__dirname, "../../static/precompressed/", element), (err) => { return err });
        });
    })
    .catch((error) => {
        console.log("catched error: ", error)
    });
};

const filemv = (img) => {
    let fileName = null;
    let fileNames = [];
    if (img === null) { return null }
    if (Array.isArray(img)) {
        for (let i = 0; i < img.length; i++) {
            fileName = uuid.v4() + ".jpg";
            img[i].mv(path.resolve(__dirname, "../../", "static/precompressed", fileName));
            fileNames.push(fileName);
        }
    } else {
        fileName = uuid.v4() + ".jpg";
        img.mv(path.resolve(__dirname, "../../", "static/precompressed", fileName));
        fileNames.push(fileName);
    }
    return fileNames;
}

class itemController {
    async create(req, res, next) {
        try {
            let { username, title, description, phone, price, userid, state, typeid, locationid } = req.body;
            const { img } = req.files;
            const checkItems = await Item.findAll({
                where: {
                    username
                }
            });
        
            if (img.length > 5) {
                next(ApiError.badRequest("Лимит изображений 5 штук!"))
            }

            if (checkItems.length >= 10) {
                next(ApiError.badRequest("Лимит объвлений 10 штук"))
            }

            title = title.toLowerCase();
                let photos = filemv(img);
                processImages(photos);
 
                const item = await Item.create({ username, title, description, price, userid, phone, photo: photos, state, typeid, locationid })
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

    async search(req, res, next) {
        let { title, limit, page } = req.query;
        try {
            title = title.toLowerCase();
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;
            sequelize.fn('lower', sequelize.col('firstname'));
            let items = await Item.findAndCountAll({ where: { title: { [Op.substring]: `${title}%` }, published: true }, limit, offset });
            return res.json(items);
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            let { title, description, price, id, deleted, state, typeid, locationid } = req.body;
            let names = undefined;
            let item = await Item.findOne({ where: { id } });
            deleted = deleted.split(",")
            if (deleted.length) {
                deleted.forEach(element => {
                    fs.unlink(path.resolve(__dirname, "../../static", element), (err) => { return err });
                });
            }
            let newPhoto = item.photo;
            newPhoto = newPhoto.filter(e => {
                if (deleted.indexOf(e) >= 0) {
                    return false;
                } else { return true }
            })

            if (req.files) {
                var { img } = req.files
                names = filemv(img);
            }
            if (names) {
                newPhoto = newPhoto.concat(names);
            }

            await Item.update(
                { title, description, price, photo: newPhoto, state, published: false, typeid, locationid },
                { where: { id } })
            return res.status(200).json({ message: "Updated" });
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            let { userid, id } = req.query;
            let item = await Item.findOne({ where: { userid, id } });
            let isItem = await Item.destroy({ where: { userid, id } });

            if (item.photo.length) {
                item.photo.forEach(e => {
                    fs.unlink(path.resolve(__dirname, "../../static", e), (err) => { return err });
                })
            }

            if (isItem) {
                return res.status(200).json({ id });
            } else {
                return res.status(400).json({ message: "The item not exist" });
            }
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new itemController();