import express from "express"
import {uploadResult} from "../controllers/staff"

const staffsRouter = express.Router()

staffsRouter.patch("/staff/upload", uploadResult)

export default staffsRouter