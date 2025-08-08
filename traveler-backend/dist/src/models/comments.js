"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const users_1 = __importDefault(require("./users"));
const posts_1 = __importDefault(require("./posts"));
class Comment extends sequelize_1.Model {
}
Comment.init({
    id: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    content: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    owner: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    postId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
}, { sequelize: db_1.default, modelName: "Comment", tableName: "comments", timestamps: false });
Comment.belongsTo(users_1.default, { foreignKey: "owner" });
Comment.belongsTo(posts_1.default, { foreignKey: "postId" });
posts_1.default.hasMany(Comment, { foreignKey: "postId" });
exports.default = Comment;
//# sourceMappingURL=comments.js.map