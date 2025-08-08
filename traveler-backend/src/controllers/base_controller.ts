
import { Request, Response } from "express";
import { Model } from "mongoose";

class BaseController<T> {
  model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async getAll(req: Request, res: Response, filterField?: String) {
    if(!filterField){
      filterField = "owner";
    }
    const filter = req.query[filterField as string];    
    try {
      if (filter) {
        const items = await this.model.find({ [filterField as any]: filter }).populate('owner', 'username');
        res.send(items);
      } else {
        const items = await this.model.find().populate('owner', 'username');
        res.send(items);
      }

    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getById(req: Request, res: Response) {
    const itemId = req.params.id;

    try {
      const item = await this.model.findById(itemId).populate('owner', 'username');
      if (item != null) {
        res.send(item);
      } else {
        res.status(404).send("item not found");
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async createItem(req: Request, res: Response) {
    const itemBody = req.body;
    try {
      const item = await this.model.create(itemBody);
      res.status(201).send(item);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async updateItem(req: Request, res: Response) {
    const itemBody = req.body;
    const itemId = req.params.id;
    try {
      const item = await this.model.findById(itemId);
      if (item != null) {
        for (const key in itemBody) {
          if (itemBody.hasOwnProperty(key)) {
            item[key] = itemBody[key]; 
          }
        }
        await item.save();
        res.status(200).send(item);
      } else {
          res.status(404).send("item not found");
      }   
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  
  async deleteItem(req: Request, res: Response) {
    const itemId = req.params.id;
    try {
      const rs = await this.model.findByIdAndDelete(itemId);
      res.status(200).send(rs);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default BaseController;
