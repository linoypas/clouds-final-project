import { Request, Response } from "express";
import BaseController from "./base_controller";
import Comment from "../models/comments"; 

class CommentsController extends BaseController<Comment> {
  constructor() {
    super(Comment);
  }

  async create(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const commentData = {
        ...req.body,
        owner: userId,  
      };

      req.body = commentData;

      await super.createItem(req, res);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default new CommentsController();
