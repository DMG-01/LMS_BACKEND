import express from "express"
import {uploadResult, editResult} from "../controllers/staff"

const staffsRouter = express.Router()

staffsRouter.patch("/staff/upload", uploadResult)
staffsRouter.patch("/staff/Result/edit",editResult)

export default staffsRouter