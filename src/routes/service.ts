import express, {RequestHandler} from "express";
import {createNewServiceTemplate,returnAService,getAllServices, removeProperty, changePrice, addNewProperty} from "../controllers/serviceTemplate";
import { wrap } from "module";

const serviceRouter = express.Router();

const wrapMiddleware = (fn: Function): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


serviceRouter.post("/service", createNewServiceTemplate);
serviceRouter.get("/service/:serviceId",returnAService )
serviceRouter.get("/service", wrapMiddleware(getAllServices))
serviceRouter.patch("/service/change_price", changePrice)
serviceRouter.delete("/service/remove_property", removeProperty)
serviceRouter.patch("/service/addProperty", addNewProperty)


export default serviceRouter;
