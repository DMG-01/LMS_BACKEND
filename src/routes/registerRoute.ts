import express, {Request, Response, RequestHandler} from "express"
import { RegisterAPatient } from "../controllers/register"
import statusCodes from "http-status-codes"

const registerRouter = express.Router()
const wrapMiddleware = (fn: Function): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

registerRouter.post("/register", wrapMiddleware(RegisterAPatient))

export default registerRouter