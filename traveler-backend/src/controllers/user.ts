import userModel, { IUser } from "../models/users";
import { Request, Response } from "express";
import BaseController from "./base_controller";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

class UserController extends BaseController<IUser> {
  constructor() {
    super(userModel);
  }
  async updateItem(req: MulterRequest, res: Response): Promise<void> {
    const userId = req.params.id;
    console.log("Updating user with ID:", userId);
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file); 

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (req.body.username) {
            user.username = req.body.username;
        }

        if (req.file) {
            user.image = `/public/profile-pictures/${req.file.filename}`;
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
    const userId = req.params.id;

    try {
      const user = await this.model.findById(userId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      console.log("User Data:", user); 
      res.json({
        _id: user._id,
        email: user.email,
        username: user.username,
        image: user.image ? `${user.image}` : null, 
      });

    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new UserController();
