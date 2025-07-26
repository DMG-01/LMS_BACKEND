import express, {RequestHandler} from "express"
import {uploadResult, editResult, returnAPatientHistory, patientHistory} from "../controllers/staff"
import {changeARegisterStatus} from "../controllers/register"
import staffAuthentication from "../middleware/authentiction";

const staffsRouter = express.Router()
const wrapMiddleware = (fn: Function): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


staffsRouter.patch("/staff/upload",wrapMiddleware(staffAuthentication), uploadResult)
staffsRouter.patch("/staff/Result/edit",wrapMiddleware(staffAuthentication),editResult)
staffsRouter.get("/staff/patientHistory",wrapMiddleware(staffAuthentication),patientHistory)
staffsRouter.get("/staff/patientHistory/:patientId",wrapMiddleware(staffAuthentication),returnAPatientHistory )
staffsRouter.patch(`/staff/test/toggleStatus/:testVisitId`,wrapMiddleware(staffAuthentication), changeARegisterStatus )

export default staffsRouter