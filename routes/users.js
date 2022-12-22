import express from "express"
import { getUser , updateUser, getAllUser} from "../controllers/user.js"

const router = express.Router()

//can make any API requests here
// can use user router in the index file

router.get("/find/:userId", getUser) 
//getUse was defined in controllers/user

router.get("/", getAllUser) 

router.put("/", updateUser) 


export default router