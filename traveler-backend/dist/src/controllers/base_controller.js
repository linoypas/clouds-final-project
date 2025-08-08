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
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    constructor(model) {
        this.model = model;
    }
    getAll(req, res, filterField) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!filterField) {
                filterField = "owner";
            }
            const filter = req.query[filterField];
            try {
                if (filter) {
                    const items = yield this.model.find({ [filterField]: filter }).populate('owner', 'username');
                    res.send(items);
                }
                else {
                    const items = yield this.model.find().populate('owner', 'username');
                    res.send(items);
                }
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemId = req.params.id;
            try {
                const item = yield this.model.findById(itemId).populate('owner', 'username');
                if (item != null) {
                    res.send(item);
                }
                else {
                    res.status(404).send("item not found");
                }
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    createItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemBody = req.body;
            try {
                const item = yield this.model.create(itemBody);
                res.status(201).send(item);
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    updateItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemBody = req.body;
            const itemId = req.params.id;
            try {
                const item = yield this.model.findById(itemId);
                if (item != null) {
                    for (const key in itemBody) {
                        if (itemBody.hasOwnProperty(key)) {
                            item[key] = itemBody[key];
                        }
                    }
                    yield item.save();
                    res.status(200).send(item);
                }
                else {
                    res.status(404).send("item not found");
                }
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    deleteItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemId = req.params.id;
            try {
                const rs = yield this.model.findByIdAndDelete(itemId);
                res.status(200).send(rs);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
}
exports.default = BaseController;
//# sourceMappingURL=base_controller.js.map