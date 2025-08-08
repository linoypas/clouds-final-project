import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import User from "./users";
import Post from "./posts";

interface CommentAttributes {
  id: number;
  content: string;
  owner: number; // FK to User.id
  postId: number; // FK to Post.id
}

interface CommentCreationAttributes extends Optional<CommentAttributes, "id"> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: number;
  public content!: string;
  public owner!: number;
  public postId!: number;
}

Comment.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    owner: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    postId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  { sequelize, modelName: "Comment", tableName: "comments", timestamps: false }
);

Comment.belongsTo(User, { foreignKey: "owner" });
Comment.belongsTo(Post, { foreignKey: "postId" });
Post.hasMany(Comment, { foreignKey: "postId" });

export default Comment;
