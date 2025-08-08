import commentModel, { IComment } from "../models/comments";
import { Request, Response } from "express";
import BaseController from "./base_controller";

class CommentsController extends BaseController<IComment> {
  constructor() {
    super(commentModel);
  }

  async create(req: Request, res: Response) {
    const userId = req.params.userId
    const comment = {
      ...req.body,
      owner: userId,
    };
    req.body = comment;
    super.createItem(req, res);
  }
}

export default new CommentsController();