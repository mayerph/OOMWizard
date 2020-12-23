import { Router, Request, NextFunction, Response } from "express"
import { v4 as uuidv4 } from "uuid"
import { Login } from "./login.model"
import { UserController } from "../user/user.controller"

const userController = new UserController()

var jwt = require("jsonwebtoken")
var crypto = require("crypto")

// we sign our jwt tokens with this key :)
// it will change every time we start
const jwtKey = uuidv4().toString()
// logout users automatically after 300 seconds
const jwtExpirySeconds = 300

const createAndSetJwtToken = (res: Response, username: String) => {
  const token = jwt.sign({ username }, jwtKey, {
    algorithm: "HS256",
    expiresIn: jwtExpirySeconds
  })
  res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
}

export class LoginController {
  /**
   * Creates a middleware function that verifies the jwt token.
   * It can be installed with:
   *  <br> app.use('/path', verifyLogin()) , router.user('/path', verifyLogin())
   *  <br> app.Method('/path', verifyLogin()) ...
   */
  verifyLogin() {
    // TODO ? Maybe we could implement some for of automatic token refresh here
    return (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies.token
      if (!token) {
        return res.status(400).end()
      }
      try {
        let payload = jwt.verify(token, jwtKey)
        return next()
      } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
          res.redirect("/login")
          return res.end()
        }
        return res.status(401).end()
      }
    }
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    //FIXME care SQLInjection, should be caught by library
    const { username, password } = req.body
    const salt = uuidv4()
    if (await Login.findOne({ username: username }).exec()) {
      return res.status(400).end()
    }
    const login = new Login({
      username: username,
      salt: salt,
      saltedHashedPassword: crypto
        .createHash("sha512")
        .update(salt)
        .update(password)
        .digest("hex")
    })
    login.save()
    console.log("created login for:", username)
    userController.addUser({ name: username })

    createAndSetJwtToken(res, username)
    res.redirect("/")
    return res.end()
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body
    const user = await Login.findOne({ username: username })
    if (
      !user ||
      !password ||
      user.saltedHashedPassword !==
        crypto
          .createHash("sha512")
          .update(user.salt)
          .update(password)
          .digest("hex")
    ) {
      return res.status(401).end()
    }
    createAndSetJwtToken(res, username)
    res.redirect("/")
    return res.end()
  }
}
