/*import express, {RequestHandler} from "express";
import {createService,removePropertyToService, changeServicePrice, returnServiceDetail, getAllService, addNewPropertyToService} from "../controllers/serviceTemplate";
import { wrap } from "module";

const serviceRouter = express.Router();

const wrapMiddleware = (fn: Function): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


serviceRouter.post("/service", wrapMiddleware(createService));
serviceRouter.get("/service/:serviceId", wrapMiddleware(returnServiceDetail))
serviceRouter.get("/service", wrapMiddleware(getAllService))
serviceRouter.patch("/service/change_price", wrapMiddleware(changeServicePrice))
serviceRouter.delete("/service/remove_property", wrapMiddleware(removePropertyToService))
serviceRouter.patch("/service/addProperty", wrapMiddleware(addNewPropertyToService))


export default serviceRouter;
*/