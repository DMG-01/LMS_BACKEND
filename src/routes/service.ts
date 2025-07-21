import express, {RequestHandler} from "express";
import {createNewServiceTemplate, editProperty, returnAService,getAllServices, removeProperty, changePrice, addNewProperty} from "../controllers/serviceTemplate";
import { wrap } from "module";
import staffAuthentication from "../middleware/authentiction";

const serviceRouter = express.Router();

const wrapMiddleware = (fn: Function): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


serviceRouter.post("/service",wrapMiddleware(staffAuthentication), createNewServiceTemplate);
serviceRouter.get("/service/:serviceId",wrapMiddleware(staffAuthentication),returnAService )
serviceRouter.get("/service", wrapMiddleware(staffAuthentication),wrapMiddleware(getAllServices))
serviceRouter.patch("/service/change_price", wrapMiddleware(staffAuthentication),changePrice)
serviceRouter.delete("/service/:serviceId/removeproperty/:propertyId",wrapMiddleware(staffAuthentication), removeProperty)
serviceRouter.patch("/service/addProperty",wrapMiddleware(staffAuthentication), addNewProperty)
serviceRouter.patch('/service/:serviceId/property/:propertyId', wrapMiddleware(staffAuthentication),editProperty)




export default serviceRouter;
