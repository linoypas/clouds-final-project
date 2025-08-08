import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import User from "./users";

interface PostAttributes {
  id: number;
  title: string;
  content: string;
  owner: number; // FK to User.id
  likes: string[];
  image?: string;
}

interface PostCreationAttributes extends Optional<PostAttributes, "id" | "likes" | "image"> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public owner!: number;
  public likes!: string[];
  public image?: string;
}

Post.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    owner: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    likes: { type: DataTypes.JSON, defaultValue: [] },
    image: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "Post", tableName: "posts", timestamps: false }
);

Post.belongsTo(User, { foreignKey: "owner" });
User.hasMany(Post, { foreignKey: "owner" });

export default Post;
