import { UserController } from "./user.controller"

let userController: UserController
describe("list()", () => {
  beforeEach(() => {
    userController = new UserController()
  })

  test("should test something", async () => {
    expect((await userController.getUsers()).length).toBe(3)
  })
})
