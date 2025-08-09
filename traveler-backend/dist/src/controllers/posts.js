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
const posts_1 = __importDefault(require("../models/posts"));
const base_controller_1 = __importDefault(require("./base_controller"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class PostsController extends base_controller_1.default {
    constructor() {
        super(posts_1.default);
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = req.file
                ? req.file.location
                : undefined;
            const { title, content } = req.body;
            try {
                const newPost = yield this.model.create({
                    title,
                    content,
                    image,
                });
                res.status(201).send(newPost);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemId = req.params.id;
            try {
                const item = yield this.model.findByPk(itemId);
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
                    item.image = req.file.location;
                }
                yield item.save();
                res.status(200).send(item);
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
}
exports.default = new PostsController();
//# sourceMappingURL=posts.js.map