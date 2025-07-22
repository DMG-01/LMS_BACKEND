import express, {RequestHandler}  from "express"
import {superSignUp, staffLogin} from "../controllers/auth"

const auth = express.Router()

const wrapMiddleware = (fn: Function): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

auth.post(`/super/signup`, superSignUp)
auth.post(`/staff/login`, wrapMiddleware(staffLogin))

export default auth