"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serviceTemplate_1 = require("../controllers/serviceTemplate");
const authentiction_1 = __importDefault(require("../middleware/authentiction"));
const serviceRouter = express_1.default.Router();
const wrapMiddleware = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
serviceRouter.post("/service", wrapMiddleware(authentiction_1.default), serviceTemplate_1.createNewServiceTemplate);
serviceRouter.get("/service/:serviceId", wrapMiddleware(authentiction_1.default), serviceTemplate_1.returnAService);
serviceRouter.get("/service", wrapMiddleware(authentiction_1.default), wrapMiddleware(serviceTemplate_1.getAllServices));
serviceRouter.patch("/service/change_price", wrapMiddleware(authentiction_1.default), serviceTemplate_1.changePrice);
serviceRouter.delete("/service/:serviceId/removeproperty/:propertyId", wrapMiddleware(authentiction_1.default), serviceTemplate_1.removeProperty);
serviceRouter.patch("/service/addProperty", wrapMiddleware(authentiction_1.default), serviceTemplate_1.addNewProperty);
serviceRouter.patch('/service/:serviceId/property/:propertyId', wrapMiddleware(authentiction_1.default), serviceTemplate_1.editProperty);
exports.default = serviceRouter;
