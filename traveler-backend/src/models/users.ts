import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

interface UserAttributes {
  id: number;
  email: string;
  password?: string;
  refreshToken?: string[];
  username: string;
  profilePicture?: string;
  googleId?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "password" | "refreshToken" | "profilePicture" | "googleId"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password?: string;
  public refreshToken?: string[];
  public username!: string;
  public profilePicture?: string;
  public googleId?: string;
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    profilePicture: { type: DataTypes.STRING, defaultValue: "/public/profile-pictures/default.png" },
    refreshToken: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    googleId: { type: DataTypes.STRING, allowNull: true, unique: true },
  },
  { sequelize, modelName: "User", tableName: "users", timestamps: false }
);

export default User;
