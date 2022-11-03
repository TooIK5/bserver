const ApiError = require("../../error/apierror");
const { User, Basket, Item } = require("../../models/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require('fs');
const uuid = require("uuid");
const path = require("path");

let generateJWT = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
    )
}

const filemv = (img) => {
    let fileName = uuid.v4() + ".jpg";

    if (img === undefined) { return undefined }
    img.mv(path.resolve(__dirname, "../../", "static", fileName));

    return fileName;
}

class UserController {
    async registration(req, res, next) {
        const { email, password, role, username } = req.body;
        if (!email || !password) {
            return next(ApiError.badRequest("Некорректный email или password"));
        }
        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            return next(ApiError.badRequest("Пользователь с таким email уже существует"));
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({ email, role, password: hashPassword, username })
        const basket = await Basket.create({ userId: user.id })
        const token = generateJWT(user.id, email, user.role);
        return res.json({ token, user })
    }

    async login(req, res, next) {
        const { email, password } = req.body
        const user = await User.findOne({
            where: { email }
        })
        if (!user) {
            return next(ApiError.internal("Пользователь с таким именем не найден"))
        }

        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal("Указан неверный пароль"))
        }
        user.password = null;
        const token = generateJWT(user.id, user.email, user.role);
        return res.json({ token, user })
    }

    async check(req, res, next) {
        try {
            const token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const user = await User.findOne({
                where: { email: decoded.email }
            });
            res.json({  user })
        } catch (e) {
            return next(ApiError.internal("Токен истек"))
        }
    }

    async getmyads(req, res) {
        const { userid } = req.query;
        const items = await Item.findAll({ where: { userid } })
        res.json(items);
    }

    async update(req, res, next) {

        const { id, username, description, locationId } = req.body;
        const user = await User.findOne(

            {
                where: { id },
                attributes: { exclude: ['password'] },
            })

        var { avatar } = req.files;
        let name = filemv(avatar);

        fs.unlink(path.resolve(__dirname, "../../static", user.avatar), (err) => { });
        const items = await User.update(
            { id, username, description, avatar: name, locationId },
            { where: { id } })

        res.json(user);
    }
}

module.exports = new UserController();