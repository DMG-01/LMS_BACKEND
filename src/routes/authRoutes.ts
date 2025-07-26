import express, {RequestHandler}  from "express"
import {superSignUp, validateToken,  staffLogin} from "../controllers/auth"
import { wrap } from "module";
import staffAuthentication from "../middleware/authentiction";

const auth = express.Router()

const wrapMiddleware = (fn: Function): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

auth.post(`/super/signup`, superSignUp)
auth.post(`/staff/login`, wrapMiddleware(staffLogin))
auth.get("/auth", wrapMiddleware(staffAuthentication), validateToken)

export default auth