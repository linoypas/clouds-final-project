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

  async getAll(req: Request, res: Response, filterField: string = "owner") {
    const rawFilter = req.query[filterField];
    
    // Ensure filter is a string primitive (ignore if it's an object)
    let filter: string | undefined;
  
    if (typeof rawFilter === "string") {
      filter = rawFilter;
    } else if (Array.isArray(rawFilter)) {
      // if array, take first string element
      filter = typeof rawFilter[0] === "string" ? rawFilter[0] : undefined;
    } else {
      filter = undefined; // ignore ParsedQs objects or other types
    }
  
    try {
      let items;
      if (filter) {
        items = await this.model.findAll({
          where: { [filterField]: filter } as any, // cast here to bypass
          include: [{ association: 'owner', attributes: ['username'] }],
        });
        
      } else {
        items = await this.model.findAll({
          include: [{ association: 'owner', attributes: ['username'] }],
        });
      }
      res.send(items);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getById(req: Request, res: Response) {
    const itemId = req.params.id;
    try {
      const item = await this.model.findByPk(itemId, {
        include: [{ association: 'owner', attributes: ['username'] }],
      });
      if (item) {
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
