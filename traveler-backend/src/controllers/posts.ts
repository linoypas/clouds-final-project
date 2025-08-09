import Post from "../models/posts";
import { Request, Response } from "express";
import BaseController from "./base_controller";
import dotenv from "dotenv";
import OpenAI from "openai";
import multer from "multer";

dotenv.config();

class PostsController extends BaseController<Post> {
  constructor() {
    super(Post);
  }

  async create(req: Request, res: Response) {
    const image = (req as any).file 
    ? (req as any).file.location 
    : undefined;
    const { title, content } = req.body;
    
    try {
      const newPost = await this.model.create({
        title,
        content,
        image,
      });
      res.status(201).send(newPost);
    } catch (error) {
      res.status(400).send(error);
    }
  }
  

  async update(req: Request, res: Response) {
    const itemId = req.params.id;
    try {
      const item = await this.model.findByPk(itemId);
      if (!item) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      if (req.body.title) {
        item.title = req.body.title;
      }
      if (req.body.content) {
        item.content = req.body.content;
      }
      if (req.file) {
        item.image = (req as any).file.location;
      }
      await item.save();
      res.status(200).send(item);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}  
export default new PostsController();
