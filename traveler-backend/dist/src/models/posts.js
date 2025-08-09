"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const users_1 = __importDefault(require("./users"));
class Post extends sequelize_1.Model {
}
Post.init({
    id: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    content: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    owner: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    likes: { type: sequelize_1.DataTypes.JSON, defaultValue: [] },
    image: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, { sequelize: db_1.default, modelName: "Post", tableName: "posts", timestamps: false });
Post.belongsTo(users_1.default, { as: 'owner', foreignKey: 'owner' });
users_1.default.hasMany(Post, { as: 'posts', foreignKey: 'owner' });
exports.default = Post;
//# sourceMappingURL=posts.js.map