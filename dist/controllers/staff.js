"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnAPatientHistory = exports.patientHistory = exports.editResult = exports.tivateStaff = exports.registerANewStaff = exports.changeStaffPermission = exports.uploadResult = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const association_1 = require("../models/association");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uploadResult = async (req, res) => {
    try {
        if (!req.body) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json({ msg: `missing request body` });
            return;
        }
        console.log(`request body found`);
        const { serviceId, parameterTemplateId, result } = req.body;
        if (!serviceId || !result || !parameterTemplateId) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json({
                msg: `missing required parameter`
            });
            return;
        }
        console.log(`complete parameter`);
        let _serviceWithRegNo;
        try {
            console.log(`checking...`);
            _serviceWithRegNo = await association_1.Service.findOne({
                where: {
                    id: serviceId
                }
            });
            console.log("found...", _serviceWithRegNo);
        }
        catch (err) {
            console.error("❌ Error during findOne:", err);
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
                msg: "Error fetching service",
                error: err
            });
            return;
        }
        console.log(`found...`);
        console.log(`checking for service...`);
        if (!_serviceWithRegNo) {
            console.log(`service with reg number not found`);
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `no service of id ${serviceId}  found`
            });
            return;
        }
        console.log(`service with reg number found`);
        console.log(`awaiting response`);
        const response = await _serviceWithRegNo.uploadResult(result, parameterTemplateId);
        if (response.success == 1) {
            res.status(http_status_codes_1.default.OK).json({
                result: response._testResult
            });
            return;
        }
        else if (response.status == 0) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: response.msg
            });
            return;
        }
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: error
        });
    }
};
exports.uploadResult = uploadResult;
const editResult = async (req, res) => {
    try {
        if (!req.body) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json({
                msg: `MISSING REQUEST BODY`
            });
            return;
        }
        const { resultId, serviceId, newValue } = req.body;
        if (!resultId || !serviceId || !newValue) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json({
                msg: `MISSING REQUIRED PARAMETER`
            });
            return;
        }
        const _result = await association_1.TestResult.findOne({
            where: {
                id: resultId,
                serviceId: serviceId
            }
        });
        if (!_result) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `no result with corresponding id ${resultId} and serviceId ${serviceId} found`
            });
            return;
        }
        console.log(_result.value);
        _result.value = newValue;
        const newResult = await _result.save();
        console.log(newResult.value);
        res.status(http_status_codes_1.default.OK).json({
            msg: `change successful`
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `INTERNAL_SERVER_ERROR`
        });
        return;
    }
};
exports.editResult = editResult;
const patientHistory = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, email } = req.query;
        const where = {};
        if (firstName)
            where.firstName = firstName;
        if (lastName)
            where.lastName = lastName;
        if (phoneNumber)
            where.phoneNumber = phoneNumber;
        if (email)
            where.email = email;
        let _patientHistory;
        _patientHistory = await association_1.Patient.findAll({
            where,
            include: [{
                    model: association_1.patientTestTable,
                    as: "tests",
                    include: [{
                            model: association_1.Service,
                            as: "services",
                            include: [{
                                    model: association_1.TestResult,
                                    as: "testResult",
                                    include: [{
                                            model: association_1.TestParameterTemplate,
                                            as: "parameter"
                                        }]
                                }]
                        }]
                }]
        });
        res.status(http_status_codes_1.default.OK).json({
            _patientHistory
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
exports.patientHistory = patientHistory;
const returnAPatientHistory = async (req, res) => {
    try {
        const patientHistory = await association_1.Patient.findOne({
            where: {
                id: req.params.patientId
            },
            include: [{
                    model: association_1.patientTestTable,
                    as: "tests",
                    include: [{
                            model: association_1.Service,
                            as: "services",
                            include: [{
                                    model: association_1.TestResult,
                                    as: "testResult",
                                    include: [{
                                            model: association_1.TestParameterTemplate,
                                            as: "parameter"
                                        }]
                                }]
                        }]
                }]
        });
        if (!patientHistory) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `no patient with id ${req.params.patientId} found`
            });
            return;
        }
        res.status(http_status_codes_1.default.OK).json({
            patientDetail: patientHistory
        });
        return;
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `INTERNAL_SERVER_ERROR`
        });
    }
};
exports.returnAPatientHistory = returnAPatientHistory;
const registerANewStaff = async (req, res) => {
    try {
        const isManagement = req.user.hasManegeralRole;
        if (!isManagement) {
            res.status(http_status_codes_1.default.UNAUTHORIZED).json({
                msg: ` UNAUTUTHORIZED`
            });
            return;
        }
        if (!req.body) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json({
                msg: `MISSING REQUEST BODY`
            });
            return;
        }
        const { firstName, lastName, password, phoneNumber, hasManegerialRole, hasAccountingRole } = req.body;
        if (!firstName || !lastName || !password || !phoneNumber || !hasManegerialRole || !hasAccountingRole) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json({
                msg: `MISSING REQUIRED PARAMETER`
            });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const encryptedPassword = await bcryptjs_1.default.hash(password, salt);
        const newStaff = await association_1.Staff.create({
            firstName,
            lastName,
            password: encryptedPassword,
            phoneNumber,
            hasManegerialRole,
            hasAccountingRole,
            status: true
        });
        res.status(http_status_codes_1.default.CREATED).json({
            phoneNumber,
            password
        });
        return;
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `INTERNA;_SERVER_ERROR`,
            error
        });
        return;
    }
};
exports.registerANewStaff = registerANewStaff;
const tivateStaff = async (req, res) => {
    try {
        const isManagement = req.user.hasManegeralRole;
        if (!isManagement) {
            res.status(http_status_codes_1.default.UNAUTHORIZED).json({
                msg: ` UNAUTUTHORIZED`
            });
            return;
        }
        const staffToTivate = await association_1.Staff.findOne({
            where: {
                id: req.params.staffId
            }
        });
        if (!staffToTivate) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `NO STAFF WITH ID ${req.params.staffId}`
            });
            return;
        }
        staffToTivate.status = !staffToTivate.status;
        await staffToTivate.save();
        res.status(http_status_codes_1.default.OK).json({
            msg: `STATUS CHANGED`,
        });
        return;
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `INTERNAL_SERVER_ERROR`,
            error
        });
        return;
    }
};
exports.tivateStaff = tivateStaff;
const changeStaffPermission = async (req, res) => {
    try {
        const isManagement = req.user.hasManegeralRole;
        if (!isManagement) {
            res.status(http_status_codes_1.default.UNAUTHORIZED).json({
                msg: ` UNAUTUTHORIZED`
            });
            return;
        }
        const staffRoleToChange = await association_1.Staff.findOne({
            where: {
                id: req.params.serviceId
            }
        });
        if (!staffRoleToChange) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `NOT_FOUND`
            });
        }
        Object.assign(staffRoleToChange, req.body);
        await staffRoleToChange?.save();
        res.status(http_status_codes_1.default.OK).json({
            msg: `PERMISSION SUCCS00SFULLY CHANGED`,
            staffRoleToChange
        });
        return;
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: ` INTERNAL_SERVER_ERROR`,
            error
        });
    }
};
exports.changeStaffPermission = changeStaffPermission;
