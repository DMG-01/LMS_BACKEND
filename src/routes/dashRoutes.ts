import express, {RequestHandler} from "express"
import {getAllPatient, getAPatientHistory} from "../controllers/dash"
const dashRouter = express.Router()

const wrapMiddleware = (fn: Function): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

dashRouter.get("/dash/patients", wrapMiddleware(getAllPatient))
dashRouter.get("/dash/patient/:patientId",getAPatientHistory )


export default dashRouter