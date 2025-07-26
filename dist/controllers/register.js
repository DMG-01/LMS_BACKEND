"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnARegisterDetail = exports.changeARegisterPrice = exports.returnAllRegister = exports.removeServiceFromRegisterRow = exports.deleteARegister = exports.addServiceToRegister = exports.changeARegisterStatus = exports.RegisterAPatient = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const association_1 = require("../models/association");
const serviceTemplate_1 = __importDefault(require("../models/serviceTemplate"));
const RegisterAPatient = async (req, res) => {
    console.log(`registering...`);
    if (!req.body) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ msg: "missing required parameter" });
    }
    const { patientData, selectedTemplateIds, referralName = null } = req.body;
    if (!patientData || !selectedTemplateIds) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({
            msg: "missing required parameter"
        });
    }
    try {
        // Find or create patient
        let _patient = await association_1.Patient.findOne({
            where: {
                phoneNumber: patientData.phoneNumber,
                firstName: patientData.firstName,
                lastName: patientData.lastName
            }
        });
        if (!_patient) {
            _patient = await association_1.Patient.create({
                firstName: patientData.firstName,
                lastName: patientData.lastName,
                phoneNumber: patientData.phoneNumber,
                email: patientData.email,
                dateOfBirth: patientData.dateOfBirth
            });
            console.log("new patient created");
        }
        // Handle referral if provided
        let referralId = null;
        if (referralName) {
            let referral = await association_1.Referral.findOne({ where: { name: referralName } });
            if (!referral) {
                referral = await association_1.Referral.create({ name: referralName });
            }
            referralId = referral.id;
        }
        // Create test visit
        const register = await association_1.patientTestTable.create({
            patientId: _patient.id,
            status: "uncompleted",
            amountPaidInCash: patientData.amountPaidInCash ? patientData.amountPaidInCash : 0,
            amountPaidWithPos: patientData.amountPaidWithPos ? patientData.amountPaidWithPos : 0,
            amountPaidInTransfer: patientData.amountPaidInTransfer ? patientData.amountPaidInTransfer : 0,
            referralId: referralId, // <-- Always included (either actual ID or null)
            dateTaken: new Date().toISOString().split("T")[0]
        });
        // Add services
        for (let i = 0; i < selectedTemplateIds.length; i++) {
            const isServiceValid = await serviceTemplate_1.default.findOne({
                where: { id: selectedTemplateIds[i] }
            });
            if (isServiceValid) {
                await association_1.Service.create({
                    name: isServiceValid.name,
                    price: isServiceValid.price,
                    testVisitId: register.id,
                    serviceTemplateId: isServiceValid.id
                });
            }
        }
        // Final response
        const fullRegister = await association_1.patientTestTable.findOne({
            where: { id: register.id },
            include: [{
                    model: association_1.Service,
                    as: "services"
                }]
        });
        return res.status(http_status_codes_1.default.CREATED).json({
            msg: "patient added to register successfully",
            register: fullRegister
        });
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: "an error occurred while creating register"
        });
    }
};
exports.RegisterAPatient = RegisterAPatient;
const returnARegisterDetail = async (req, res) => {
    try {
        const _register = await association_1.patientTestTable.findOne({
            where: {
                id: req.params.registerId
            }
        });
        if (!_register) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `no testVist with id ${req.params.registerId} found`
            });
            return;
        }
        const response = await _register.getRegisterDetail();
        if (response.status === 1) {
            res.status(http_status_codes_1.default.OK).json({
                msg: `detail of register of id ${req.params.registerId} found`,
                register: response.register
            });
        }
        else {
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
                error: response?.error
            });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `INTERNAL_SERVER-ERROR`,
            error
        });
    }
};
exports.returnARegisterDetail = returnARegisterDetail;
const changeARegisterPrice = async (req, res) => {
    if (!req.body) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            msg: `missing request body`
        });
        return;
    }
    const { newPrice, methodOfPayment } = req.body;
    if (!newPrice || methodOfPayment === "cash" || "transfer" || "POS") {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            msg: `missing required parameter `
        });
    }
    try {
        const _registerToChange = await association_1.patientTestTable.findOne({
            where: {
                id: req.params.registerId
            }
        });
        if (!_registerToChange) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `no register of id ${req.params.registerId} found`
            });
            return;
        }
        const response = await _registerToChange.changeAmountPaid(newPrice, methodOfPayment);
        res.status(http_status_codes_1.default.OK).json({
            msg: response.msg
        });
        return;
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            error
        });
    }
};
exports.changeARegisterPrice = changeARegisterPrice;
const removeServiceFromRegisterRow = async (req, res) => {
    if (!req.body) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            msg: `missing request body`
        });
        return;
    }
    const { serviceIdToRemove } = req.body;
    try {
        if (!serviceIdToRemove) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json({
                msg: `missing required parameter`
            });
            return;
        }
        const _registerRow = await association_1.patientTestTable.findOne({
            where: {
                id: req.params.registerId
            }
        });
        if (!_registerRow) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `no row of id ${req.params.registerId}`
            });
            return;
        }
        const response = await _registerRow.removeService(serviceIdToRemove);
        if (response.status === 0) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({ msg: response.msg });
            return;
        }
        if (response.status === 1) {
            res.status(http_status_codes_1.default.OK).json({
                msg: response.msg
            });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            error
        });
        return;
    }
};
exports.removeServiceFromRegisterRow = removeServiceFromRegisterRow;
const addServiceToRegister = async (req, res) => {
    if (!req.body) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            msg: `missing request body`
        });
        return;
    }
    const { serviceIdToAdd } = req.body;
    try {
        if (!serviceIdToAdd) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json({
                msg: `missing required parameter`
            });
            return;
        }
        const _registerRow = await association_1.patientTestTable.findOne({
            where: {
                id: req.params.registerId
            }
        });
        if (!_registerRow) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `no row of id ${req.params.registerId}`
            });
            return;
        }
        const response = await _registerRow.addService(serviceIdToAdd);
        if (response.status === 0) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json({
                msg: response.msg
            });
            return;
        }
        if (response.status === 1) {
            res.status(http_status_codes_1.default.OK).json({
                msg: response.msg,
                serviceIdToAdd
            });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `INTERNAL_SERVER_ERROR`
        });
    }
};
exports.addServiceToRegister = addServiceToRegister;
const returnAllRegister = async (req, res) => {
    try {
        const { dateTaken, date, firstName, lastName, labNumber, patientId, page = 1, limit = 20 } = req.query;
        const filters = {};
        const patientFilters = {};
        if (dateTaken || date) {
            filters.dateTaken = dateTaken || date;
        }
        if (patientId) {
            filters.patientId = patientId;
        }
        if (firstName) {
            patientFilters.firstName = firstName;
        }
        if (lastName) {
            patientFilters.lastName = lastName;
        }
        if (labNumber) {
            filters.id = labNumber;
        }
        const _page = Number(page);
        const _limit = Number(limit);
        const offset = (_page - 1) * _limit;
        const { count, rows } = await association_1.patientTestTable.findAndCountAll({
            where: filters,
            include: [
                { model: association_1.Patient, as: "patient", where: patientFilters },
                {
                    model: association_1.Service,
                    as: "services",
                    attributes: ["name"],
                },
            ],
            order: [["createdAt", "DESC"]],
            limit: _limit,
            offset,
        });
        const totalPages = Math.ceil(count / _limit);
        // If no results but count exists and page is too high, retry page 1
        if (rows.length === 0 && count > 0 && _page > totalPages) {
            const { rows: retryRows } = await association_1.patientTestTable.findAndCountAll({
                where: filters,
                include: [
                    { model: association_1.Patient, as: "patient" },
                    {
                        model: association_1.Service,
                        as: "services",
                        attributes: ["name"],
                    },
                ],
                order: [["createdAt", "DESC"]],
                limit: _limit,
                offset: 0,
            });
            return res.status(200).json({
                data: retryRows,
                pagination: {
                    totalItems: count,
                    totalPages,
                    currentPage: 1,
                    limit: _limit,
                },
                message: "Page exceeded. Returning page 1 instead.",
            });
        }
        res.status(200).json({
            data: rows,
            pagination: {
                totalItems: count,
                totalPages,
                currentPage: _page,
                limit: _limit,
            },
            message: "Registers fetched successfully",
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.returnAllRegister = returnAllRegister;
const deleteARegister = async (req, res) => {
    const _register = association_1.patientTestTable.destroy({
        where: {
            id: req.params.testVisitId
        }
    });
    if (!_register) {
        res.status(http_status_codes_1.default.NOT_FOUND).json({
            msg: `No register with test id ${req.params.testVisitId} found`
        });
        return;
    }
    res.status(http_status_codes_1.default.OK).json({
        msg: `testVisit with id ${req.params.testVisitId} deleted`
    });
    return;
};
exports.deleteARegister = deleteARegister;
const changeARegisterStatus = async (req, res) => {
    try {
        const _register = await association_1.patientTestTable.findOne({
            where: {
                id: req.params.testVisitId
            }
        });
        if (!_register) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `NOT_FOUND`
            });
            return;
        }
        const status = await _register.toggleStatus();
        res.status(http_status_codes_1.default.OK).json({
            msg: `${status}`
        });
        return;
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `AN INTERNAL_SERVER_ERROR_OCCURED`
        });
        return;
    }
};
exports.changeARegisterStatus = changeARegisterStatus;
