"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewProperty = exports.editProperty = exports.getAllServices = exports.changePrice = exports.removeProperty = exports.returnAService = exports.createNewServiceTemplate = void 0;
const association_1 = require("../models/association");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createNewServiceTemplate = async (req, res) => {
    console.log(`creating new service`);
    if (!req.body) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            msg: `missing required parameter`
        });
    }
    const { name, price } = req.body;
    if (!name || !price) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            msg: ` missing required parameter`
        });
    }
    try {
        const newServiceTemplate = await association_1.ServiceTemplate.create({
            name,
            price
        });
        res.status(http_status_codes_1.default.CREATED).json({
            msg: "new service has been created",
            newServiceTemplate
        });
        return;
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: "INTERNAL_SERVER_ERROR",
            error: error
        });
    }
};
exports.createNewServiceTemplate = createNewServiceTemplate;
const changePrice = async (req, res) => {
    if (!req.body) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            msg: `missing request body`
        });
        return;
    }
    const { serviceId, price } = req.body;
    if (!serviceId || !price) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            msg: `missing required parameter`
        });
        return;
    }
    try {
        const _serviceTemplate = await association_1.ServiceTemplate.findOne({
            where: {
                id: serviceId
            }
        });
        if (!_serviceTemplate) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `no service with id ${serviceId} found`
            });
        }
        const priceChange = await _serviceTemplate?.changePrice(price);
        if (priceChange?.status === 1) {
            res.status(http_status_codes_1.default.OK).json({
                msg: `price changed successful`,
                newPrice: price
            });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `INTERNAL_SERVER_ERROR`,
            error: error
        });
    }
};
exports.changePrice = changePrice;
const editProperty = async (req, res) => {
    if (!req.body) {
        res.status(http_status_codes_1.default.BAD_REQUEST);
    }
    try {
        const _service = await association_1.ServiceTemplate.findOne({
            where: {
                id: req.params.serviceId
            }
        });
        if (!_service) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `Service with id ${req.params.serviceId} not found`
            });
            return;
        }
        const response = await _service.editProperty(req.body, Number(req.params.propertyId));
        if (response.success === 1) {
            res.status(http_status_codes_1.default.OK).json({
                msg: response.msg
            });
        }
        else if (response.success === 0) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: response.msg
            });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `INTERNAL_SERVER_ERROR`
        });
    }
};
exports.editProperty = editProperty;
const addNewProperty = async (req, res) => {
    if (!req.body) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            msg: `missing req.body`
        });
        return;
    }
    const { propertyName, serviceId, propertyUnit, referenceValue } = req.body;
    console.log(`request seen`);
    console.log(req.body);
    if (!propertyName || !serviceId || !propertyUnit || !referenceValue) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            msg: `missing required parameter`
        });
        return;
    }
    try {
        const _service = await association_1.ServiceTemplate.findOne({
            where: {
                id: serviceId
            }
        });
        if (!_service) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `no service with id ${serviceId}`
            });
            return;
        }
        const response = await _service.addNewProperty(propertyName, propertyUnit, referenceValue);
        if (response?.status === 1) {
            res.status(http_status_codes_1.default.OK).json({
                msg: "new property added successfully",
                newProperty: response.newProperty
            });
            return;
        }
        else if (response?.status === 0) {
            res.status(http_status_codes_1.default.OK).json({
                msg: response.msg,
            });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `INTERNAL_SERVER_ERROR`,
            error: error
        });
    }
};
exports.addNewProperty = addNewProperty;
const removeProperty = async (req, res) => {
    try {
        const _service = await association_1.ServiceTemplate.findOne({
            where: {
                id: req.params.serviceId
            }
        });
        if (!_service) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `no service with id ${req.params.serviceId} found`
            });
            return;
        }
        const response = await _service.removeProperty(Number(req.params.propertyId));
        if (response.success === 1) {
            res.status(http_status_codes_1.default.OK).json({
                msg: response.msg,
                propertyToRemove: response.propertyToRemove
            });
            return;
        }
        else if (response.success === 0) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: response.msg
            });
            return;
        }
    }
    catch (error) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `INTERNAL_SERVER_ERROR`,
            error: error
        });
    }
};
exports.removeProperty = removeProperty;
const getAllServices = async (req, res) => {
    try {
        const { name } = req.query;
        const filters = {};
        if (name) {
            filters.name = name;
        }
        const _AllServices = await association_1.ServiceTemplate.findAll({
            include: [{
                    model: association_1.TestParameterTemplate,
                    as: "testParameters"
                }],
            where: filters
        });
        if (_AllServices.length < 1) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: `no service found`
            });
            return;
        }
        res.status(http_status_codes_1.default.OK).json({
            _AllServices
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            msg: `INTERNAL_SERVER_ERROR`,
            error
        });
    }
};
exports.getAllServices = getAllServices;
const returnAService = async (req, res) => {
    try {
        const _service = await association_1.ServiceTemplate.findOne({
            where: {
                id: req.params.serviceId
            },
            include: [{
                    model: association_1.TestParameterTemplate,
                    as: "testParameters"
                }]
        });
        if (!_service) {
            res.status(http_status_codes_1.default.NOT_FOUND).json({
                msg: ` no service with id ${req.params.id} found`
            });
            return;
        }
        res.status(http_status_codes_1.default.OK).json({
            _service
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
exports.returnAService = returnAService;
