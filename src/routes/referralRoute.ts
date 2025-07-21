import express, {Request, Response, NextFunction, RequestHandler} from "express"
import {returnAllReferral, returnAReferralDetail, payDiscount, returnReferralsVisitTable} from "../controllers/referrals"
const referralRouter = express.Router()
import staffAuthentication from "../middleware/authentiction";
import { Next } from "mysql2/typings/mysql/lib/parsers/typeCast";

const wrapMiddleware = (fn: Function): RequestHandler => {
  return (req:Request, res : Response, next : NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

referralRouter.get("/referrals", wrapMiddleware(staffAuthentication),  returnAllReferral)
referralRouter.get("/referral/:referralId", wrapMiddleware(staffAuthentication), returnAReferralDetail)
referralRouter.patch("/referral/:id",wrapMiddleware(staffAuthentication),  payDiscount)
referralRouter.get("/referralsRegister/:referralId",wrapMiddleware(staffAuthentication), returnReferralsVisitTable)

export default referralRouter