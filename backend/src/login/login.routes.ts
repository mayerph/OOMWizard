import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { LoginController } from "./login.controller"
var cors = require('cors')

const router = express.Router()
const loginController = new LoginController()

router.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    return await loginController.logOut(req, res, next)
  }
)

router.post(
  "/signIn",
  async (req: Request, res: Response, next: NextFunction) => {
    return await loginController.signIn(req, res, next)
  }
)

router.post(
  "/signUp",
  async (req: Request, res: Response, next: NextFunction) => {
    return await loginController.signUp(req, res, next)
  }
)

export default router
