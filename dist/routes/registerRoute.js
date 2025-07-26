"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_1 = require("../controllers/register");
const authentiction_1 = __importDefault(require("../middleware/authentiction"));
const registerRouter = express_1.default.Router();
const wrapMiddleware = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
registerRouter.post("/register", wrapMiddleware(authentiction_1.default), wrapMiddleware(register_1.RegisterAPatient));
registerRouter.get("/register/:registerId", wrapMiddleware(authentiction_1.default), register_1.returnARegisterDetail);
registerRouter.delete("/register/:testVisitId", wrapMiddleware(authentiction_1.default), register_1.deleteARegister);
registerRouter.patch("/register/changeAmountPaid/:registerId", wrapMiddleware(authentiction_1.default), register_1.changeARegisterPrice);
registerRouter.patch("/register/addService/:registerId", wrapMiddleware(authentiction_1.default), register_1.addServiceToRegister);
registerRouter.patch("/register/removeService/:registerId", wrapMiddleware(authentiction_1.default), register_1.removeServiceFromRegisterRow);
registerRouter.get("/register", wrapMiddleware(authentiction_1.default), wrapMiddleware(register_1.returnAllRegister));
exports.default = registerRouter;
