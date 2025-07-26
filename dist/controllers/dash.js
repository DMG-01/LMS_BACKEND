"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAPatientHistory = exports.getAllPatient = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const association_1 = require("../models/association");
const getAllPatient = async (req, res) => {
    try {
        const _allPatient = await association_1.Patient.findAndCountAll();
        if (!_allPatient) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `no patient exist in database`
            });
            return;
        }
        return res.status(http_status_codes_1.default.OK).json({
            patients: _allPatient
        });
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `INTERNAL_SERVER_ERROR`
        });
    }
};
exports.getAllPatient = getAllPatient;
const getAPatientHistory = async (req, res) => {
    try {
        const _patient = await association_1.Patient.findOne({
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
                }],
        });
        if (!_patient) {
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
                msg: `no patient with id  ${req.params.patientId} found`
            });
            return;
        }
        res.status(http_status_codes_1.default.OK).json({
            patient: _patient
        });
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `INTERNAL_ERROR_OCCURED`
        });
    }
};
exports.getAPatientHistory = getAPatientHistory;
