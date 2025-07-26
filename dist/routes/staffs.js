"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const staff_1 = require("../controllers/staff");
const register_1 = require("../controllers/register");
const authentiction_1 = __importDefault(require("../middleware/authentiction"));
const staffsRouter = express_1.default.Router();
const wrapMiddleware = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
staffsRouter.patch("/staff/upload", wrapMiddleware(authentiction_1.default), staff_1.uploadResult);
staffsRouter.patch("/staff/Result/edit", wrapMiddleware(authentiction_1.default), staff_1.editResult);
staffsRouter.get("/staff/patientHistory", wrapMiddleware(authentiction_1.default), staff_1.patientHistory);
staffsRouter.get("/staff/patientHistory/:patientId", wrapMiddleware(authentiction_1.default), staff_1.returnAPatientHistory);
staffsRouter.patch(`/staff/test/toggleStatus/:testVisitId`, wrapMiddleware(authentiction_1.default), register_1.changeARegisterStatus);
exports.default = staffsRouter;
