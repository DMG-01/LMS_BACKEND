import express, {RequestHandler} from "express";
import { createService, changeServicePrice, getAllService} from "../controllers/service";

const serviceRouter = express.Router();

const wrapMiddleware = (fn: Function): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


serviceRouter.post("/service", wrapMiddleware(createService));
serviceRouter.get("/service", wrapMiddleware(getAllService))
serviceRouter.patch("/service/change_price", wrapMiddleware(changeServicePrice))


export default serviceRouter;
