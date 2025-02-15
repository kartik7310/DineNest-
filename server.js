import "dotenv/config";
import express from "express";
import authRoute from "./routes/authRoute.js";
import restaurantRoute from "./routes/Restaurant.js";
import menuRoute from "./routes/menuRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middlewares/errorMiddleware.js";
  const port = process.env.PORT || 8001;
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
const corsOption = {
  origin: "http://example.com", //fronted url
  optionsSuccessStatus: 200,
};
app.use(cors(corsOption)); 
app.use("/api/v1/", authRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/menu", menuRoute); 
app.get("/home", (req, res) => {
  res.send("Home page !");
});

app.use(errorHandler);
app.listen(port, () => {
  console.log(`server is start on ${port}`);
});
