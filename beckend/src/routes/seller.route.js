import express from "express";
import sellerController from "../controller/seller.controller.js";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { getClothes, getClothesById, createClothes, updateClothes, deleteClothes } from "../controller/clothes.controller.js";
import { validateSellerRegister } from "../validation/seller.validatioj.js";

const router = express.Router();

router.post("/register", validateSellerRegister, sellerController.register);
router.post("/login", sellerController.login);

router.get("/me", authMiddleware, sellerController.getMe);
router.put("/me", authMiddleware, sellerController.updateMe);
router.delete("/me", authMiddleware, sellerController.deleteMe);
router.post("/subscribe", authMiddleware, sellerController.activateSubscription);

// ⚠️ /clothes route'lari /:id dan OLDIN bo'lishi SHART
router.get("/clothes", authMiddleware, getClothes);
router.get("/clothes/:id", authMiddleware, getClothesById);
router.post("/clothes", authMiddleware, createClothes);
router.put("/clothes/:id", authMiddleware, updateClothes);
router.delete("/clothes/:id", authMiddleware, deleteClothes);

// Admin endpointlari (dinamik /:id bo'lgani uchun eng oxirida)
router.get("/", authMiddleware, adminOnly, sellerController.getAll);
router.get("/:id", authMiddleware, adminOnly, sellerController.getOne);
router.patch("/:id/status", authMiddleware, adminOnly, sellerController.updateStatus);

export default router;