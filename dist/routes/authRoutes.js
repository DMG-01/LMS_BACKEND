"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const authentiction_1 = __importDefault(require("../middleware/authentiction"));
const auth = express_1.default.Router();
const wrapMiddleware = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
auth.post(`/super/signup`, auth_1.superSignUp);
auth.post(`/staff/login`, wrapMiddleware(auth_1.staffLogin));
auth.get("/auth", wrapMiddleware(authentiction_1.default), auth_1.validateToken);
exports.default = auth;
