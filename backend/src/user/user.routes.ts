import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { UserController } from "./user.controller"
import { LoginController} from "../login/login.controller"

const router = express.Router()
const loginController = new LoginController()
const userController = new UserController()

/**
 * delete a certain user
 */
router.delete(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user == null) {
      return res.status(400).send("You are not logged in.")
    }
    try{
      await userController.deleteUser(req.user)
      return res.status(200).end()
    }catch(err){
      return res.status(500).json(err).end()
    }
  }
)


export default router
