"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class Post extends sequelize_1.Model {
}
Post.init({
    id: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    content: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    image: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, { sequelize: db_1.default, modelName: "Post", tableName: "posts", timestamps: false });
exports.default = Post;
//# sourceMappingURL=posts.js.map