import statusCodes from "http-status-codes"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {Staff} from "../models/association"
import {Request, Response} from "express"
import dotenv from "dotenv"
dotenv.config()



const superSignUp = async(req : Request, res : Response)=> {

    try {

        if(!req.body) {
            res.status(statusCodes.BAD_REQUEST).json({
                msg : `MISSING REQUEST BODY`
            })
            return
        }

        const {firstName, lastName, phoneNumber, password} = req.body

        if(!firstName || !lastName || !phoneNumber || !password ) {
            res.status(statusCodes.BAD_REQUEST).json({
                msg : `MISSING REQUIRED PARAMETER`
            })
            return
        }

        const salt =await  bcrypt.genSalt(10)
        const encodedPassword = await bcrypt.hash(password, salt)
        const _isFirstStaff = await Staff.findAndCountAll()
         if(_isFirstStaff.count > 0) {
            res.status(statusCodes.UNAUTHORIZED).json({
                msg : `UNAUTHORIZED`
            })
            return 
         }
         else {
            const firstStaff = await Staff.create({
                firstName, 
                lastName, 
                phoneNumber, 
                password : encodedPassword, 
                hasManegerialRole : true, 
                hasAccountingRole : true,
                status : true
            })
            await firstStaff.save()

            res.status(statusCodes.ACCEPTED).json({
                msg : `sign up successful`, 
                staff : {
                    firstName : firstStaff.firstName, 
                    lastName : firstStaff.lastName, 
                    phoneNumber : firstStaff.phoneNumber
                }
            })
            return
         }
        

    }catch(error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            smg : `INTERNAL_SERVER_ERROR`
        })
        return
    }

}

const staffLogin = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(statusCodes.BAD_REQUEST).json({
        msg: 'MISSING REQUEST BODY',
      });
    }

    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(statusCodes.BAD_REQUEST).json({
        msg: 'MISSING REQUIRED PARAMETER',
      });
    }

    const _staff = await Staff.findOne({
      where: { phoneNumber },
    });

    if (!_staff) {
      return res.status(statusCodes.NOT_FOUND).json({
        msg: `NO STAFF WITH PHONE NUMBER ${phoneNumber} FOUND`,
      });
    }

    const validPassword = await bcrypt.compare(password, _staff.password);

    if (!validPassword) {
      return res.status(statusCodes.UNAUTHORIZED).json({ msg: 'UNAUTHORIZED' });
    }

   
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in .env');
    }

    const token = jwt.sign(
      { userId: _staff.id ,
        hasManegeralRole : _staff.hasManegerialRole, 
        hasAccountingRole : _staff.hasAccountingRole
      },
      jwtSecret,
      { expiresIn: '1d' }
    );


    res.cookie('accesstoken', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, 
    });

    return res.status(statusCodes.ACCEPTED).json({
      msg: 'LOGIN SUCCESSFUL',
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'INTERNAL_SERVER_ERROR',
    });
  }
};



export {superSignUp, staffLogin}

