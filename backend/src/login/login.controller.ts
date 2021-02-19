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
  const token = jwt.sign({ username: username }, jwtKey, {
    algorithm: "HS256",
    expiresIn: jwtExpirySeconds
  })
  res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
}

export class LoginController {


  /**
   * Creates middleware that verifes a jwt token
   * and injects the username into request.user
   */
  verify_and_inject_user(){
    return (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies.token
      if(token){
        try{// inject user into req if valid
          let payload = jwt.verify(token, jwtKey)
          req.user = payload.username
        }catch(err){
          console.log("Token for", err, "could not be validated")
        }
      }
      next()
    }
  }

  require_user(){
    return (req: Request, res: Response, next: NextFunction) => {
       if(!req.user){
         res.status(403).send("Please login").end()
       }else{
         next()
       }
    }
  }
  
  async logOut(req: Request, res: Response, next: NextFunction) {
    const token = jwt.sign({username: ''}, jwtKey, {
      algorithm: "HS256",
      expiresIn: 0
    })
    res.cookie("token", token, { maxAge: 0})
    return res.status(200).end()
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body

    if (username == null || username === ''){
      return res.status(400).send("Username may not be empty!")
    }
    if (password == null || password === ''){
      return res.status(400).send("Password may not be empty!")
    }
    if(password.length < 8){
      return res.status(400).send("Password must contain at least 8 letters.")
    }

    const salt = uuidv4()
    const saltedHashedPassword = crypto
        .createHash("sha512")
        .update(salt)
        .update(password)
        .digest("hex")
    
    try{
      await userController.addUser(
        username,
        salt,
        saltedHashedPassword,)
      createAndSetJwtToken(res,username)
      return res.status(200).end()
    } catch(err){
      return res.status(500).json(err)
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body

    if (username == null || username === ''){
      return res.status(400).send("Username may not be empty!")
    }
    if (password == null || password === ''){
      return res.status(400).send("Password may not be empty!")
    }

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
      return res.status(401).send("invalid user password combination")
    }
    createAndSetJwtToken(res, username)
    console.log("Logged in user:", username)
    return res.status(200).end()
  }
}
