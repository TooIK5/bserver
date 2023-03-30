const { Dialog, Message, User, Unreaded, keyKeeper } = require("../../models/models");
const ApiError = require("../../error/apierror");
const Op = require('sequelize').Op;
const sequelize = require('sequelize');

class chatController {
    async removeUnreadebale(req, res, next) {
        console.log("REMOVE UNREADABLE 1 ")
        try {
            let {did, uid} = req.query;
            uid = +uid;
            did = +did;
            console.log("remove UNREADABLE 2")
            const array = await Unreaded.findOne({where: {uid}});
           
            let newArr = array.did;
            console.log("remove UNREADABLE 3", newArr)
            let index = newArr.indexOf(did);
      
                if (index > -1) {
                    newArr.splice(index, 1);
                    console.log(newArr);
                    await Unreaded.update(
                        {did: newArr},
                        {where: {uid}}
                        );
                        console.log("remove UNREADABLE 4", did)
                        return res.json(did)
                } 
                console.log("remove UNREADABLE 5")
                return res.json({})
        }
        catch (error) {
            console.error("get", error.message)
        }
    }

    async setUnreadebale(uid, did, next) {
        try {
            const array = await Unreaded.findOne({where: {uid}});
            let newArr = array.did;
                if (newArr.indexOf(did) > -1) {
                    
                } else {
                 
                    newArr.push(did)
            
                }

            await Unreaded.update(
                {did: newArr},
                {where: {uid}}
                );
        }
        catch (error) {
            console.error("set", error.message)
        }
    }

    async getUnreadebale(req, res, next) {
        try {
            let { uid } = req.query;
            let unreaded = await Unreaded.findOne(
                {
                    where: { uid: uid },
                },
            )
            return res.json(unreaded)
        }
        catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

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
        console.log("get messages")
        try {
            console.log("get messages")
            let { did } = req.query;
            did = +did;
          
            console.log(did)
            let msg = await Message.findAll(
                {
                    where: { DialogId: did },
                },
            )
            return res.json(msg)
        }
        catch (error) {
            console.log("get message")
            next(ApiError.badRequest(error.message))
        }
    }

    async getDialogs(req, res, next) {
        let { userid } = req.query;
        try {
            console.log("get dialogs")
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
                userProps[i].dataValues.rid = ids[index];
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

            res.status(200)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
    async subscribe(req, res, next) {

    }
    async unsubscribe(req, res, next) {

    }
}

module.exports = new chatController();