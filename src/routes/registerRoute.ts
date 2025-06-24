import express, {Request, Response} from "express"
import { RegisterAPatient } from "../controllers/register"
import statusCodes from "http-status-codes"

const registerRouter = express.Router()

registerRouter.post("/register", async(req: Request, res : Response)=> {
    try {
    const patientInReg = await RegisterAPatient(req.body)
    if(patientInReg) {
        res.status(statusCodes.CREATED).json({msg:`patient successfully registered`,patientInReg })
    }}catch(error) {
        console.log(error)
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({msg : `INTERNAL_SERVER_ERROR`, error})
    }
})


export default registerRouter