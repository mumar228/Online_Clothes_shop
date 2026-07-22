import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRotes from "./routes/user.route.js";
import ClothesRoutes from "./routes/clothes.rote.js";
import { AppDataSource } from "./config/data-sorce.js";
import SellerRoutes from "./routes/seller.route.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 3008;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use((req, res, next) => {
  console.log(`>>> ${req.method} ${req.url}`);
  next();
});

app.use("/user", userRotes);
app.use("/clothes", ClothesRoutes);
app.use("/seller", SellerRoutes);

// ✅ Error handler ENG OXIRIDA bo'lishi kerak (routalardan keyin)
app.use((err, req, res, next) => {
  console.error(err.stack); // debug uchun foydali
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

AppDataSource.initialize()
  .then(() => {
    console.log("Postgres TypeORM orqali ulandi");
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portda ishlamoqda`);
    });
  })
  .catch((err) => {
    console.error("DB ulanishda xato ❌", err);
    process.exit(1);
  });