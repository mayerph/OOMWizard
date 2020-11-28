import * as express from 'express'
import { Router, Request, NextFunction, Response } from 'express'
import { UserController } from "./user.controller";

const router = express.Router();
const userController = new UserController()

/**
 * get all users
 */
router.get('', async (req: Request, res: Response, next: NextFunction) => {
    const users = await userController.getUsers()
    console.log('users', users)
    res.json(users)
})

/**
 * get a certain user
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const user = await userController.getUserById(req.params.id)
    res.json(user)
})

/**
 * add new user
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    console.log('req.body', req.body)
    const user = await userController.addUser(req.body)
    res.send()
})

/**
 * update a certain user
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const user = await userController.updateUser(id, req.body)
    res.json(user)    
})

/**
 * delete a certain user
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const user = await userController.deleteUser(id)
    res.send('User')
})

export default router



