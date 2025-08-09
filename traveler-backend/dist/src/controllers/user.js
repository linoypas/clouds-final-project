"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("../models/users"));
const base_controller_1 = __importDefault(require("./base_controller"));
class UserController extends base_controller_1.default {
    constructor() {
        super(users_1.default);
    }
    updateItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            console.log("Updating user with ID:", userId);
            console.log("Request body:", req.body);
            console.log("Uploaded file:", req.file);
            try {
                const user = yield this.model.findByPk(userId);
                if (!user) {
                    res.status(404).json({ message: "User not found" });
                    return;
                }
                if (req.body.username) {
                    user.username = req.body.username;
                }
                if (req.file) {
                    user.profilePicture = req.file.location;
                }
                yield user.save();
                console.log("User updated successfully:", user);
                res.status(200).json(user);
            }
            catch (error) {
                console.error("Error updating user:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = Number(req.params.id);
            if (isNaN(userId)) {
                res.status(400).json({ message: "Invalid user ID" });
                return;
            }
            try {
                const user = yield this.model.findByPk(userId);
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
            }
            catch (error) {
                console.error("Error fetching user:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=user.js.map