const dbConfig = require("../config/database");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./userModels")(sequelize, Sequelize);
db.messages = require("./messageModels")(sequelize, Sequelize);
db.comments = require("./commentModels")(sequelize, Sequelize);
db.likes = require("./likeModels")(sequelize,Sequelize);

db.users.hasMany(db.messages);
db.users.hasMany(db.comments);
db.users.hasMany(db.likes);
db.messages.hasMany(db.comments);
db.messages.hasMany(db.likes);
db.messages.belongsTo(db.users, {
  foreignKey: "userId"
});
db.comments.belongsTo(db.users, {
  foreignKey: "userId"
});
db.comments.belongsTo(db.messages, {
  foreignKey: "messageId"
});
db.likes.belongsTo(db.users, {
  foreignKey: "userId"
});
db.likes.belongsTo(db.messages, {
  foreignKey: "messageId"
});


module.exports = db;