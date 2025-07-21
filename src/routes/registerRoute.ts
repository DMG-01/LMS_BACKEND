import express, {Request, Response, RequestHandler} from "express"
import {RegisterAPatient,returnAllRegister, addServiceToRegister,deleteARegister, removeServiceFromRegisterRow, changeARegisterPrice, returnARegisterDetail} from "../controllers/register"
import statusCodes from "http-status-codes"
import staffAuthentication from "../middleware/authentiction";

const registerRouter = express.Router()
const wrapMiddleware = (fn: Function): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

registerRouter.post("/register", wrapMiddleware(staffAuthentication), wrapMiddleware(RegisterAPatient))
registerRouter.get("/register/:registerId",wrapMiddleware(staffAuthentication), returnARegisterDetail)
registerRouter.delete("/register/:testVisitId",wrapMiddleware(staffAuthentication), deleteARegister)
registerRouter.patch("/register/changeAmountPaid/:registerId",wrapMiddleware(staffAuthentication), changeARegisterPrice)
registerRouter.patch("/register/addService/:registerId",wrapMiddleware(staffAuthentication), addServiceToRegister)
registerRouter.patch("/register/removeService/:registerId", wrapMiddleware(staffAuthentication),removeServiceFromRegisterRow)
registerRouter.get("/register",wrapMiddleware(staffAuthentication), wrapMiddleware(returnAllRegister))
export default registerRouter