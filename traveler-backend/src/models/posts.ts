import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

interface PostAttributes {
  id: number;
  title: string;
  content: string;
  image?: string;
}

interface PostCreationAttributes extends Optional<PostAttributes, "id" | "image"> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public image?: string;
}

Post.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "Post", tableName: "posts", timestamps: false }
);

export default Post;
