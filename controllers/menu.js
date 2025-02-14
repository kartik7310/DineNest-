import uploadImageOnCloudinary from "../utils/image.js";
import prisma from "../database/db.js";
import { customError } from "../utils/customError.js";
// Create Menu
export const createMenu = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price || isNaN(parseFloat(price))) {
      throw new customError("All fields are required, and price must be a valid number", 400);
    }

    const { id } = req.user; 

    if (!id) {
      throw new customError("User is not authenticated", 401);
    }

    const file = req.file;
    if (!file) {
      throw new customError("File not provided", 400);
    }

    const imageUrl = await uploadImageOnCloudinary(file);
    if (!imageUrl) {
      throw new customError("File upload failed", 500);
    }

   
    const restaurant = await prisma.restaurant.findFirst({
      where: { userId: id },
    });

    if (!restaurant) {
      throw new customError("Restaurant not found", 404);
    }
    const menu = await prisma.menu.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image: imageUrl,
        restaurant: {
          connect: { id: restaurant.id },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Menu created successfully.",
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};


export const editMenu = async (req, res, next) => {
  try {
    const { menuId } = req.params;
console.log(req.params);
console.log(req.body.name);


    // Check if menuId is provided
    if (!menuId) {
      throw new customError("Menu id not provided");
    }

    // Find the existing menu
    const menu = await prisma.menu.findUnique({ where: { id: menuId } });
    if (!menu) {
      throw new customError("Menu not found");
    }

    // Extract fields from request body
    const { name, description, price } = req.body;
console.log(req.body);

    // Prepare updates object
    const updates = {};
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (price) updates.price = parseFloat(price); // Ensures price is a number

    // Handle file upload if exists
    const file = req.file;
    if (file) {
      const imageUrl = await uploadImageOnCloudinary(file);
      if (!imageUrl) throw new customError("Image not uploaded");
      updates.image = imageUrl;
    }

    // Update the menu
    const updatedMenu = await prisma.menu.update({
      where: { id: menuId },
      data: updates,
    });

    return res.status(200).json({ message: "Menu updated successfully.", updatedMenu });
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};
export const deleteMenu = async (req, res, next) => {
  try {
    const { menuId } = req.params;
    const {id} = req.user;

    if (!id) {
      throw new customError("User ID is required");
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: id },
    });

    if (!restaurant) {
      throw new customError("Restaurant not found");
    }

    // Check if menuId is provided
    if (!menuId) {
      throw new customError("Menu id not provided");
    }

    // Find the existing menu
    const menu = await prisma.menu.findUnique({ where: { id: menuId } });

    if (!menu) {
      throw new customError("Menu not found");
    }

    // Delete the menu
    await prisma.menu.delete({ where: { id: menuId } });

    return res.status(200).json({ message: "Menu deleted successfully." });
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};
export const getAllMenus = async (req, res, next) => {
  try {
 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page <= 0 || limit <= 0) {
      throw new customError("Page and limit must be positive integers!");
    }

    const offset = (page - 1) * limit;

    const menus = await prisma.menu.findMany({
      skip: offset,
      take: limit,
      include:{
        restaurant:{
          select:{
            restaurantName:true,
           
          }
        }
      } 
    });

    const totalRestaurants = await prisma.restaurant.count();

    if (menus.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No menus found!",
        data: [],
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalRestaurants / limit),
          totalRestaurants,
          limit,
        },
      });
    }

    const totalPages = Math.ceil(totalRestaurants / limit);

    return res.status(200).json({
      success: true,
      message: "menus retrieved successfully",
      data: menus,
      pagination: {
        currentPage: page,
        totalPages,
        totalRestaurants,
        limit,
      },
    });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  
  }
  }

  
export const getSingleMenu = async (req, res, next) => {
  try {
    const { menuId } = req.params;
    
    if (!menuId) return res.status(400).json({ error: "menu id not provided" });

    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
      include: {
        restaurant: {
          select: {
            restaurantName: true,
          },
        },
      },
    });
    
    if (!menu) {
      return next(new customError("menu not found!", 404));
    }

    return res.status(200).json({
      success: true,
      message: "menu fetch success",
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};