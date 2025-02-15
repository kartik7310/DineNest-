import { Router } from "express";
const router = Router();
import upload from "../utils/multer.js";

import {
  CreateRestaurant,
  getRestaurant,
  updateRestaurant,
  getRestaurantOrder,
  updateOrderStatus,
  searchFeature,
  getSingleRestaurant,
  deleteRestaurant,
} from "../controllers/restaurent.js";
import { authMiddleware,adminMiddleware } from "../middlewares/authMiddleware.js";

router.post("/", authMiddleware,adminMiddleware, upload.single("image"), CreateRestaurant); //done

router.get("/", getRestaurant); //done

router.get("/order", authMiddleware, getRestaurantOrder);//done

router.put("/:restaurantId", authMiddleware, adminMiddleware,upload.single("image"), updateRestaurant);//done

router.get("/order/:orderId/status", authMiddleware, updateOrderStatus);

router.get("/search", searchFeature);

router.get("/:restaurantId", getSingleRestaurant);

router.delete("/:restaurantId", authMiddleware,adminMiddleware, deleteRestaurant);

export default router;
