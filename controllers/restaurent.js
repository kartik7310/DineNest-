import prisma from "../database/db.js";

import uploadImageOnCloudinary from "../utils/image.js";
import { customError } from "../utils/customError.js";
import { deleteImage } from "../utils/deleteImage.js";

export const CreateRestaurant = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      // this id extract from middleware
      throw new customError("User id not provide");
    }
    const { restaurantName, city, country, deliveryTime, cuisines, price } =
      req.body;
    const file = req.file;
    if (!file) throw new customError("Image is required");

    if (
      !restaurantName ||
      !city ||
      !country ||
      !deliveryTime ||
      !cuisines ||
      !price
    )
      throw new customError("All fields are must");

    const imageURL = await uploadImageOnCloudinary(file);
    const restaurant = await prisma.restaurant.create({
      data: {
        restaurantName,
        city,
        country,
        deliveryTime: parseInt(deliveryTime),
        cuisines: JSON.parse(cuisines), // Or pass cuisines directly if `Json` type is used
        imageURL,
        price: parseInt(price),
        userId,
        // Ensure this is the foreign key linking to the User table
      },
    });

    return res.status(200).json({
      message: "rasturant create successfully",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const getRestaurant = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page <= 0 || limit <= 0) {
      throw new customError("Page and limit must be positive integers!");
    }

    const offset = (page - 1) * limit;

    const restaurants = await prisma.restaurant.findMany({
      skip: offset,
      take: limit,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    const totalRestaurants = await prisma.restaurant.count();

    if (restaurants.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No restaurants found!",
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
      message: "Restaurants retrieved successfully",
      data: restaurants,
      pagination: {
        currentPage: page,
        totalPages,
        totalRestaurants,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateRestaurant = async (req, res, next) => {
  try {
    const { deliveryTime, cuisines, price } = req.body; // Extract fields from req.body
    const { restaurantId } = req.params; // Extract restaurantId from req.params
    const { id } = req.user; // Get user ID from the authentication middleware
    console.log(id);

    const file = req.file; // Get the uploaded file (if any)

    // Validate required fields
    if (!deliveryTime || !cuisines || !price) {
      throw new customError(
        "All fields (deliveryTime, cuisines, price) are required."
      );
    }

    // Validate user ID
    if (!id) {
      throw new customError("User ID is required.");
    }

    // Find the restaurant by ID and ensure it belongs to the logged-in user
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found!" });
    }
    console.log(restaurant.userId);

    if (restaurant.userId !== id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this restaurant.",
      });
    }

    // Handle image upload to Cloudinary if a new file is provided
    let imageUrl = restaurant.imageURL; // Retain the existing image URL by default
    if (file) {
      try {
        await deleteImage(imageUrl); // Delete the existing image from Cloudinary
        imageUrl = await uploadImageOnCloudinary(file); // Upload the new image
      } catch (error) {
        return next(error); // Forward any Cloudinary-related errors
      }
    }

    // Update the restaurant details in the database
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        deliveryTime: parseInt(deliveryTime, 10), // Convert to integer
        cuisines: JSON.parse(cuisines), // Parse JSON string if cuisines is a string
        price: parseFloat(price), // Convert price to a number
        imageURL: imageUrl, // Use the updated or existing image URL
      },
    });

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: updatedRestaurant, // Optionally return the updated restaurant
    });
  } catch (error) {
    next(error); // Forward error to error-handling middleware
  }
};

export const getRestaurantOrder = async (req, res, next) => {
  try {
    const { id } = req.user;
    console.log(id);

    if (!id) {
      throw new customError("User id not provide");
    }
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        userId: id,
      },
    });

    if (!restaurant) throw new customError(" Restaurant not found !");

    const order = await prisma.order.findMany({
      where: {
        restaurantId: restaurant.id,
      },
      include: {
        user: {
          include: {
            restaurant: true,
          },
        },
      },
    });
    console.log(order);

    if (order.length === 0) throw new customError("Order not exist!");
    return res.status(200).json({
      success: true,
      message: "order fetch successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    if (!orderId) throw new customError("order not found");
    const { status } = req.body;
    if (!status) {
      throw new customError("status are required");
    }
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    if (!order) throw new customError("Order not found");
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: status,
      },
    });
    throw new customError("status updated successfully");
  } catch (error) {
    next(error);
  }
};export const searchFeature = async (req, res, next) => {
  try {
    const restaurantName = req.query.restaurantName || "";
    const searchCity = req.query.searchCity || "";
    const selectedCuisines = (req.query.searchCuisines || "")
      .split(",")
      .filter((cuisine) => cuisine);

    // Validate at least one search parameter
    if (!restaurantName && !searchCity && selectedCuisines.length === 0) {
      throw new customError("Please provide at least one search parameter!", 400);
    }

    // Build dynamic Prisma query
    const whereCondition = {
      AND: [
        restaurantName && {
          restaurantName: {
            contains: restaurantName, // Removed `mode: "insensitive"`
          },
        },
        searchCity && {
          city: {
            contains: searchCity, // Removed `mode: "insensitive"`
          },
        },
        selectedCuisines.length > 0 && {
          cuisines: {
            hasEvery: selectedCuisines,
          },
        },
      ].filter(Boolean),
    };

    console.log("Where Condition:", JSON.stringify(whereCondition, null, 2));

    // Fetch restaurants with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const restaurants = await prisma.restaurant.findMany({
      where: whereCondition,
      orderBy: { restaurantName: "asc" },
      skip: skip,
      take: limit,
    });

    console.log("Fetched Restaurants:", restaurants);

    // Check if no results found
    if (restaurants.length === 0) {
      throw new customError("No restaurants found!", 404);
    }

    res.status(200).json({
      success: true,
      message: "Restaurants retrieved successfully",
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};
export const getSingleRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    if (!restaurantId)
      return res.status(400).json({ error: "Restaurant id not provided" });

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        menus: true,
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });

    if (!restaurant) {
      return next(new customError("Restaurant not found!", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant fetch success",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    console.log(restaurantId);

    const {id} = req.user;
 

    if (!restaurantId) throw new customError("Restaurant id not provide");
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: restaurantId,
      },
    });
    if (!restaurant) {
      throw new customError("Restaurant not found !");
    }
    if (id !== restaurant.userId) {
      throw new customError("You are not authorize to delete this restaurant");
    }
    await deleteImage(restaurant.imageURL);
    await prisma.restaurant.delete({
      where: {
        id: restaurantId,
      },
    });
    return res.status(200).json("Restaurant delete successfully");
  } catch (error) {
    next(error);
  }
};
