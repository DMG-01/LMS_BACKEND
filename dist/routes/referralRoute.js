"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const referrals_1 = require("../controllers/referrals");
const referralRouter = express_1.default.Router();
const authentiction_1 = __importDefault(require("../middleware/authentiction"));
const wrapMiddleware = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
referralRouter.get("/referrals", wrapMiddleware(authentiction_1.default), referrals_1.returnAllReferral);
referralRouter.get("/referral/:referralId", wrapMiddleware(authentiction_1.default), referrals_1.returnAReferralDetail);
referralRouter.patch("/referral/:id", wrapMiddleware(authentiction_1.default), referrals_1.payDiscount);
referralRouter.get("/referralsRegister/:referralId", wrapMiddleware(authentiction_1.default), referrals_1.returnReferralsVisitTable);
exports.default = referralRouter;
