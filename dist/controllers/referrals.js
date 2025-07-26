"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnReferralsVisitTable = exports.payDiscount = exports.returnAReferralDetail = exports.returnAllReferral = void 0;
const association_1 = require("../models/association");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const returnAllReferral = async (req, res) => {
    try {
        const allReferral = await association_1.Referral.findAll();
        if (!allReferral) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `referral found`
            });
            return;
        }
        res.status(http_status_codes_1.default.OK).json({
            allReferral
        });
        return;
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: error
        });
        return;
    }
};
exports.returnAllReferral = returnAllReferral;
const returnAReferralDetail = async (req, res) => {
    try {
        const _referral = await association_1.Referral.findOne({
            where: {
                id: req.params.referralId
            }
        });
        if (!_referral) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `no referral with id ${req.params.referralId} found`
            });
            return;
        }
        res.status(http_status_codes_1.default.OK).json({
            _referral
        });
        return;
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `INTERNAL_SERVER_ERROR`
        });
        return;
    }
};
exports.returnAReferralDetail = returnAReferralDetail;
const payDiscount = async (req, res) => {
    try {
        const { amountToPay } = req.body;
        if (!amountToPay) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json({
                msg: `no amount parsed`
            });
            return;
        }
        const _referral = await association_1.Referral.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!_referral) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({ msg: `No referral with id ${req.params.referralId} found` });
            return;
        }
        const response = await _referral.payDiscount(amountToPay);
        if (response.success === 1) {
            res.status(http_status_codes_1.default.OK).json({
                msg: response.msg
            });
            return;
        }
    }
    catch {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `INTERNAL_SERVER_ERROR`
        });
        return;
    }
};
exports.payDiscount = payDiscount;
const returnReferralsVisitTable = async (req, res) => {
    try {
        const referralVistTable = await association_1.patientTestTable.findAll({
            where: {
                referralId: req.params.referralId
            }
        });
        if (!referralVistTable) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `no register with referral of id ${req.params.referralId}`
            });
        }
        res.status(http_status_codes_1.default.OK).json({
            referralVistTable
        });
        return;
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `INTERNAL_SERVER_ERROR_OCCURED`
        });
        return;
    }
};
exports.returnReferralsVisitTable = returnReferralsVisitTable;
