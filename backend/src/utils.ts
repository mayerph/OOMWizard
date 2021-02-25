import { Router, Request, NextFunction, Response } from "express"

export function require_user(
  error_message: string = "Please log in, for private api access."
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(403).send(error_message).end()
    } else {
      next()
    }
  }
}

export function require_query_param(param_name: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query[param_name]) {
      return res.status(400).send(`Missing query param ${param_name}`).end()
    }
    return next()
  }
}

export function require_form_param(param_name: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body[param_name]) {
      return res.status(400).send(`Missing form param ${param_name}`).end()
    }
    return next()
  }
}
