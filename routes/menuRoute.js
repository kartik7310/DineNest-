import{Router} from "express";
const router = Router();
import {authMiddleware,adminMiddleware} from "../middlewares/authMiddleware.js"
import upload from "../middlewares/multer.js"//enable when image come to the frontend

import {createMenu,editMenu,deleteMenu, getAllMenus,getSingleMenu} from "../controllers/menu.js"
router.post("/",authMiddleware,adminMiddleware,upload.single('file'),createMenu);
router.put("/:menuId",authMiddleware,adminMiddleware,editMenu);
router.delete("/:menuId",authMiddleware,adminMiddleware,deleteMenu);
router.get("/getAllMenu",authMiddleware,adminMiddleware,getAllMenus);
router.get("/getSingleMenu/:menuId",getSingleMenu);
export default router;