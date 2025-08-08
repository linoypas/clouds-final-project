import postModel, { IPost } from "../models/posts";
import { Request, Response } from "express";
import BaseController from "./base_controller";
import dotenv from "dotenv";
import OpenAI from "openai";
import multer from "multer";

dotenv.config();

class PostsController extends BaseController<IPost> {
  constructor() {
    super(postModel);
  }

  async create(req: Request, res: Response) {
    const userId = req.params.userId;
    const image = (req as any).file ? `/public/uploads/${(req as any).file.filename}` : null;
    const { title, content } = req.body;
    try{
      const newPost = new postModel({
        title: title,
        content: content,
        image: image,
        owner: userId, 
      });
      await newPost.save();
      res.status(201).send(newPost);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async update(req: Request, res: Response) {
    const itemId = req.params.id;
    try {
      const item = await this.model.findById(itemId);
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
        item.image = `/uploads/${req.file.filename}`;
      }
      await item.save();
      res.status(200).send(item);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getAi(req: Request, res: Response) {
    const prompt = req.query.prompt ;
    const openai = new OpenAI();
    try {
      const response = await openai.images.generate({
        prompt: `Generate a high-quality, realistic image of a famous landmark or scenic view in ${prompt}`,
        n: 3, 
        size: "1024x1024", 
      });
      const imageUrls = response.data
      .map((img: { url?: string }) => img.url)
      .filter((url): url is string => !!url);
      res.status(200).json({ urls: imageUrls });
    } catch (error) {
      res.status(400).send(error);
    }
  }
}  
export default new PostsController();
