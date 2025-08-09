import { Request, Response } from "express";
import { Model, ModelStatic } from "sequelize";
import { ParsedQs } from "qs";


interface ModelWithId extends Model {
  id: number | string;  
}

class BaseController<T extends ModelWithId> {
  model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async getAll(req: Request, res: Response) {    
    try {
      let items;
      items = await this.model.findAll()
      res.send(items);
    } catch (error) {
      res.status(400).send(error);
      console.log(error)
    }
  }

  async getById(req: Request, res: Response) {
    const itemId = req.params.id;
    try {
      const item = await this.model.findByPk(itemId)
      if (item) {
        res.send(item);
      } else {
        res.status(404).send("item not found");
      }
    } catch (error) {
      res.status(400).send(error);
      console.log(error)
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
      const item = await this.model.findByPk(itemId);
      if (item) {
        await item.update(itemBody);
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
    // convert to number if needed
    const rawId = req.params.id;
    const id = Number(rawId);
    if (isNaN(id)) {
      res.status(400).send("Invalid ID");
      return;
    }

    try {
      const deletedCount = await this.model.destroy({ where: { id } as any });
      if (deletedCount > 0) {
        res.status(200).send({ deletedCount });
      } else {
        res.status(404).send("item not found");
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default BaseController;
