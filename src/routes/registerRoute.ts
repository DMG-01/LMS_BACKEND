import express, {Request, Response, RequestHandler} from "express"
import {RegisterAPatient,returnAllRegister, addServiceToRegister,deleteARegister, removeServiceFromRegisterRow, changeARegisterPrice, returnARegisterDetail} from "../controllers/register"
import statusCodes from "http-status-codes"

const registerRouter = express.Router()
const wrapMiddleware = (fn: Function): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

registerRouter.post("/register", wrapMiddleware(RegisterAPatient))
registerRouter.get("/register/:registerId", returnARegisterDetail)
registerRouter.delete("/register/:testVisitId", deleteARegister)
registerRouter.patch("/register/changeAmountPaid/:registerId", changeARegisterPrice)
registerRouter.patch("/register/addService/:registerId", addServiceToRegister)
registerRouter.patch("/register/removeService/:registerId", removeServiceFromRegisterRow)
registerRouter.get("/register", returnAllRegister)
export default registerRouter