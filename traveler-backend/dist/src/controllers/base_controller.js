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
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let items;
                items = yield this.model.findAll();
                res.send(items);
            }
            catch (error) {
                res.status(400).send(error);
                console.log(error);
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemId = req.params.id;
            try {
                const item = yield this.model.findByPk(itemId);
                if (item) {
                    res.send(item);
                }
                else {
                    res.status(404).send("item not found");
                }
            }
            catch (error) {
                res.status(400).send(error);
                console.log(error);
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
                const item = yield this.model.findByPk(itemId);
                if (item) {
                    yield item.update(itemBody);
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
            // convert to number if needed
            const rawId = req.params.id;
            const id = Number(rawId);
            if (isNaN(id)) {
                res.status(400).send("Invalid ID");
                return;
            }
            try {
                const deletedCount = yield this.model.destroy({ where: { id } });
                if (deletedCount > 0) {
                    res.status(200).send({ deletedCount });
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
}
exports.default = BaseController;
//# sourceMappingURL=base_controller.js.map