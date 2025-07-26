"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dash_1 = require("../controllers/dash");
const dashRouter = express_1.default.Router();
const authentiction_1 = __importDefault(require("../middleware/authentiction"));
const wrapMiddleware = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
dashRouter.get("/dash/patients", wrapMiddleware(authentiction_1.default), wrapMiddleware(dash_1.getAllPatient));
dashRouter.get("/dash/patient/:patientId", wrapMiddleware(authentiction_1.default), dash_1.getAPatientHistory);
exports.default = dashRouter;
