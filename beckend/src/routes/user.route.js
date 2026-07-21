import { Router } from "express"
import { validate } from "../middleware/validation.middleware.js"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { createUserSchema, registerSchema, loginSchema } from "../validation/user.validation.js"
import {
  getUsers,
  getUser,
  createUser,
  login,
  register,
  refresh,
  getMe,
} from "../controller/user.controller.js"

const router = Router()

router.get("/", getUsers)
router.post("/refresh", refresh);
router.post("/", validate(createUserSchema), createUser)
router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.get("/getme", authMiddleware, getMe);
router.get("/:id", getUser)
export default router;