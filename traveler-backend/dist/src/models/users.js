"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class User extends sequelize_1.Model {
}
User.init({
    id: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    username: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    profilePicture: { type: sequelize_1.DataTypes.STRING, defaultValue: "/public/profile-pictures/default.png" },
    refreshToken: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: [] },
    googleId: { type: sequelize_1.DataTypes.STRING, allowNull: true, unique: true },
}, { sequelize: db_1.default, modelName: "User", tableName: "users", timestamps: false });
exports.default = User;
//# sourceMappingURL=users.js.map