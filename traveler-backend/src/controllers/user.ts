import User from "../models/users";
import { Request, Response } from "express";
import BaseController from "./base_controller";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

class UserController extends BaseController<User> {
  constructor() {
    super(User);
  }
  async updateItem(req: MulterRequest, res: Response): Promise<void> {
    const userId = req.params.id;
    console.log("Updating user with ID:", userId);
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file); 

    try {
        const user = await this.model.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (req.body.username) {
            user.username = req.body.username;
        }

        if (req.file) {
          user.profilePicture = (req as any).file.location;
        }

        await user.save();
        console.log("User updated successfully:", user);
        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async getById(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  try {
    const user = await this.model.findByPk(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture || null,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
}

export default new UserController();