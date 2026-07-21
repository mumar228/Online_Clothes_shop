import { Router } from "express"
import { validate } from "../middleware/validation.middleware.js"
import { validateClothes} from "../validation/clothes.validation.js"
import {
  getClothes,
  getClothesById,
  createClothes,
  updateClothes,
  deleteClothes,
} from "../controller/clothes.controller.js"

const router = Router()

router.get("/", getClothes)
router.post("/", validateClothes, createClothes)
router.get("/:id", getClothesById)
router.put("/:id", validateClothes, updateClothes)
router.delete("/:id",  deleteClothes)
export default router;