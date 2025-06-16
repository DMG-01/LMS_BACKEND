import express, {RequestHandler} from "express"
import { registerAPatient, addNewService } from "../controllers/register"

const wrapMiddleware = (fn: Function): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
const registerRouter = express.Router()

registerRouter.post("/register",wrapMiddleware(registerAPatient))
registerRouter.patch("/addService/:id", wrapMiddleware(addNewService))

export default registerRouter