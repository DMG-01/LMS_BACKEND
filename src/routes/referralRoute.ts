import express from "express"
import {returnAllReferral, returnAReferralDetail, payDiscount, returnReferralsVisitTable} from "../controllers/referrals"
const referralRouter = express.Router()


referralRouter.get("/referrals", returnAllReferral)
referralRouter.get("/referral/:referralId", returnAReferralDetail)
referralRouter.patch("/referral/:id", payDiscount)
referralRouter.get("/referralsRegister/:referralId", returnReferralsVisitTable)

export default referralRouter