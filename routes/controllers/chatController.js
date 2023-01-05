const { Dialog, Message, User, keyKeeper } = require("../../models/models");
const ApiError = require("../../error/apierror");
const Op = require('Sequelize').Op;
const sequelize = require('Sequelize');

class longPulling {

    async addMessages(req, res, next) {
        const { message, did, uid } = req.body;

        try {
            await Message.create({
                text: message,
                DialogId: did,
                uid: uid
            })

            return res.status(200);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getMessages(req, res, next) {
        try {
            let { did } = req.query;
            let msg = await Message.findAll(
                {
                    where: { DialogId: did },
                },
            )
            return res.json(msg)
        }
        catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getDialogs(req, res, next) {
        let { userid } = req.query;
        try {
            let keys = await keyKeeper.findAll(
                {
                    where: { UserId: userid },
                },
            )

            let dialogsId = [];

            for (let i = 0; i < keys.length; i++) {
                dialogsId.push(keys[i].DialogId)
            }

            let dialogs = await keyKeeper.findAll(
                {
                    where: { DialogId: dialogsId, UserId: { [Op.not]: userid } },
                },
            )

            let ids = [];
            let dids = [];

            dialogs.forEach(e => {
                ids.push(e.UserId)
                dids.push(e.DialogId)
            })

            let userProps = await User.findAll(
                {
                    where: { id: ids },
                    attributes: { exclude: ["description", "email", "password", "phone", "role", "locationid", "createdAt", "updatedAt"] }
                },
            )
         
            for (let i = 0; i < userProps.length; i++) {
                let index = ids.indexOf(userProps[i].dataValues.id);
                userProps[i].dataValues.did = dids[index];
            }
            
            return res.json(userProps)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async addChat(req, res, next) {
        let { user1, user2 } = req.query;

        try {
            let checkD = await Dialog.findOne(
                {
                    where: { uids: { [Op.contains]: [+user1, +user2] } },
                }
            )

            if (checkD) {
                return next(ApiError.badRequest(checkD.id))
            }
            let dialog = await Dialog.create({
                uids: [+user1, +user2]
            });

            const userRow1 = await User.findByPk(+user1);
            const userRow2 = await User.findByPk(+user2);

            await dialog.addUser(userRow1, { through: keyKeeper });
            await dialog.addUser(userRow2, { through: keyKeeper });

            return res.json(dialog);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new longPulling();