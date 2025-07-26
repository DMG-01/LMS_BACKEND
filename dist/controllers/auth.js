"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffLogin = exports.validateToken = exports.superSignUp = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const association_1 = require("../models/association");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const superSignUp = async (req, res) => {
    try {
        if (!req.body) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json({
                msg: `MISSING REQUEST BODY`
            });
            return;
        }
        const { firstName, lastName, phoneNumber, password } = req.body;
        if (!firstName || !lastName || !phoneNumber || !password) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json({
                msg: `MISSING REQUIRED PARAMETER`
            });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const encodedPassword = await bcryptjs_1.default.hash(password, salt);
        const _isFirstStaff = await association_1.Staff.findAndCountAll();
        if (_isFirstStaff.count > 0) {
            res.status(http_status_codes_1.default.UNAUTHORIZED).json({
                msg: `UNAUTHORIZED`
            });
            return;
        }
        else {
            const firstStaff = await association_1.Staff.create({
                firstName,
                lastName,
                phoneNumber,
                password: encodedPassword,
                hasManegerialRole: true,
                hasAccountingRole: true,
                status: true
            });
            await firstStaff.save();
            res.status(http_status_codes_1.default.ACCEPTED).json({
                msg: `sign up successful`,
                staff: {
                    firstName: firstStaff.firstName,
                    lastName: firstStaff.lastName,
                    phoneNumber: firstStaff.phoneNumber
                }
            });
            return;
        }
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            smg: `INTERNAL_SERVER_ERROR`
        });
        return;
    }
};
exports.superSignUp = superSignUp;
const staffLogin = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                msg: 'MISSING REQUEST BODY',
            });
        }
        const { phoneNumber, password } = req.body;
        if (!phoneNumber || !password) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                msg: 'MISSING REQUIRED PARAMETER',
            });
        }
        const _staff = await association_1.Staff.findOne({
            where: { phoneNumber },
        });
        if (!_staff) {
            return res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `NO STAFF WITH PHONE NUMBER ${phoneNumber} FOUND`,
            });
        }
        const validPassword = await bcryptjs_1.default.compare(password, _staff.password);
        if (!validPassword) {
            return res.status(http_status_codes_1.default.UNAUTHORIZED).json({ msg: 'UNAUTHORIZED' });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in .env');
        }
        const token = jsonwebtoken_1.default.sign({ userId: _staff.id,
            hasManegeralRole: _staff.hasManegerialRole,
            hasAccountingRole: _staff.hasAccountingRole
        }, jwtSecret, { expiresIn: '1d' });
        res.cookie('accesstoken', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(http_status_codes_1.default.ACCEPTED).json({
            msg: 'LOGIN SUCCESSFUL',
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: 'INTERNAL_SERVER_ERROR',
        });
    }
};
exports.staffLogin = staffLogin;
const validateToken = (req, res) => {
    try {
        res.status(http_status_codes_1.default.OK).json({
            msg: ` cookie valid`
        });
        return;
    }
    catch (error) {
        throw new Error();
    }
};
exports.validateToken = validateToken;
