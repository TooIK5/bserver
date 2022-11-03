const sequelize = require("../db");
const { DataTypes } = require("sequelize");

let locationsval = [
    {
        "id": 1,
        "name": "Беларусь"
    },
    {
        "id": 2,
        "name": "Минск",
    },
    {
        "id": 3,
        "name": "Витебск",
    },
    {
        "id": 4,
        "name": "Могилев",
    },
    {
        "id": 5,
        "name": "Гомель",
    },
    {
        "id": 6,
        "name": "Брест",
    },
    {
        "id": 7,
        "name": "Гродно",
    },
    {
        "id": 8,
        "name": "Минская  область" 
    },
    {
        "id": 9,
        "name": "Молодечно",
        "parentid": 8
    },
    {
        "id": 10,
        "name": "Жодино",
        "parentid": 8
    },
    {
        "id": 11,
        "name": "Борисов",
        "parentid": 8
    },
    {
        "id": 12,
        "name": "Жодино",
        "parentid": 8
    },
    {
        "id": 13,
        "name": "Солигорск",
        "parentid": 8
    },
    {
        "id": 14,
        "name": "Несвиж",
        "parentid": 8
    },
];

let categoriesval = [
    {
        "id": 1,
        "name": "Колеса"
    },
    {
        "id": 2,
        "name": "26",
        "parentid": 1
    },
    {
        "id": 3,
        "name": "27.5",
        "parentid": 1
    },
    {
        "id": 4,
        "name": "28",
        "parentid": 1
    },
    {
        "id": 5,
        "name": "29",
        "parentid": 1
    },

    {
        "id": 6,
        "name": "Вилки",
    },
    {
        "id": 7,
        "name": "Пружинно-эластомерные",
        "parentid": 6
    },
    {
        "id": 8,
        "name": "Ригидные",
        "parentid": 6
    },
    {
        "id": 9,
        "name": "Воздушно-масляные",
        "parentid": 6
    },
    {
        "id": 10,
        "name": "Рамы",
    },
    {
        "id": 11,
        "name": "Туринг/грэвл",
        "parentid": 10
    },
    {
        "id": 12,
        "name": "Шоссер",
        "parentid": 10
    },
    {
        "id": 13,
        "name": "MTB",
        "parentid": 10
    },
    {
        "id": 14,
        "name": "BMX",
        "parentid": 10
    },
    {
        "id": 15,
        "name": "Втулки",
    },
    {
        "id": 16,
        "name": "Трещетка",
        "parentid": 15
    },
    {
        "id": 17,
        "name": "Кассета",
        "parentid": 15
    },
    {
        "id": 18,
        "name": "На осях",
        "parentid": 15
    },
    {
        "id": 19,
        "name": "Sram",
        "parentid": 15
    },
    {
        "id": 20,
        "name": "Shimano",
        "parentid": 15
    },
    {
        "id": 21,
        "name": "Кассеты",
    },
    {
        "id": 22,
        "name": "6 скоростей",
        "parentid": 21
    },
    {
        "id": 23,
        "name": "7 скоростей",
        "parentid": 21
    },
    {
        "id": 24,
        "name": "8 скоростей",
        "parentid": 21
    },
    {
        "id": 25,
        "name": "9 скоростей",
        "parentid": 21
    },
    {
        "id": 26,
        "name": "10 скоростей",
        "parentid": 21
    },
    {
        "id": 27,
        "name": "11 скоростей",
        "parentid": 21
    },
    {
        "id": 28,
        "name": "12 скоростей",
        "parentid": 21
    },
];

const User = sequelize.define(
    'user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    username: { type: DataTypes.STRING, defaultValue: "unnamed" },
    description: { type: DataTypes.STRING, defaultValue: "no description" },
    password: { type: DataTypes.STRING },
    avatar: { type: DataTypes.STRING, defaultValue: null },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    locationId: { type: DataTypes.INTEGER, defaultValue: 1 },
}
)

const Item = sequelize.define(
    'item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING },
    state: { type: DataTypes.INTEGER },
    userid: { type: DataTypes.INTEGER },
    description: { type: DataTypes.STRING },
    price: { type: DataTypes.INTEGER },
    published: { type: DataTypes.BOOLEAN, defaultValue: true },
    locationid: { type: DataTypes.INTEGER },
    typeid: { type: DataTypes.INTEGER },
    photo: { type: DataTypes.ARRAY(DataTypes.STRING) },
})

const Basket = sequelize.define(
    'Basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}
)

const BasketItems = sequelize.define(
    'BasketItems', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}
)

const Categories = sequelize.define(
    'Categories', {
    categories: { type: DataTypes.JSON, defaultValue: categoriesval },
}
)

const Locations = sequelize.define(
    'Locations', {
    locations: { type: DataTypes.JSON, defaultValue: locationsval },
}
)

User.hasOne(Basket);
Basket.belongsTo(User); //может иметь одного пользователя

Basket.hasMany(BasketItems, {as: "BasketItems"});
BasketItems.belongsTo(Basket);

Item.hasMany(BasketItems);
BasketItems.belongsTo(Item);

// Categories.hasMany(Item);
// Item.belongsTo(Categories);

// Locations.hasMany(Item);
// Item.belongsTo(Locations);

module.exports = {
    User,
    Basket,
    BasketItems,
    Item,
    Categories,
    Locations
}