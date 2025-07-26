"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const staffAuthentication = async (req, res, next) => {
    try {
        const encryptedToken = req.cookies.accesstoken;
        if (!encryptedToken) {
            return res.status(http_status_codes_1.default.UNAUTHORIZED).json({
                msg: "NO TOKEN FOUND",
            });
        }
        const tokenPayload = jsonwebtoken_1.default.verify(encryptedToken, process.env.JWT_SECRET);
        req.user = {
            userId: tokenPayload.userId,
            hasManagerialRole: tokenPayload.hasManagerialRole || false,
            hasAccountingRole: tokenPayload.hasAccountingRole || false,
        };
        next();
    }
    catch (error) {
        return res.status(http_status_codes_1.default.UNAUTHORIZED).json({
            msg: "INVALID OR EXPIRED TOKEN",
        });
    }
};
exports.default = staffAuthentication;
