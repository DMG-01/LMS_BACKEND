import express from "express"
import {uploadResult, editResult, returnAPatientHistory, patientHistory} from "../controllers/staff"

const staffsRouter = express.Router()

staffsRouter.patch("/staff/upload", uploadResult)
staffsRouter.patch("/staff/Result/edit",editResult)
staffsRouter.get("/staff/patientHistory",patientHistory)
staffsRouter.get("/staff/patientHistory/:patientId",returnAPatientHistory )

export default staffsRouter