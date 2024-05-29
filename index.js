import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import UserRoute from "./routes/UserRoute.js";
import RoleRoute from "./routes/RoleRoute.js";
import ObatRoute from "./routes/ObatRoute.js";
import PasienRoute from "./routes/PasienRoute.js";
import ResepObatRoute from "./routes/ResepObatRoute.js"; // Perhatikan penulisan ResepObatRoute yang benar di sini
import AuthRoute from "./routes/AuthRoute.js";
import resepObatRoute from "./routes/ResepObatRoute.js";
// import db from "./config/Database.js";

dotenv.config();

// db.authenticate()
//   .then(() => {
//     console.log("Database connected");
//     // Jalankan migrasi otomatis setiap kali server dijalankan
//     db.sync()
//       .then(() => console.log("Database synchronized"))
//       .catch((err) => console.error("Error synchronizing database:", err));
//   })
//   .catch((err) => console.error("Error connecting to database:", err));

const app = express();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Menggunakan rute-rute yang telah didefinisikan
app.use(UserRoute);
app.use(RoleRoute);
app.use(PasienRoute);
app.use(ObatRoute);
app.use(ResepObatRoute); // Gunakan ResepObatRoute yang telah didefinisikan
app.use(AuthRoute);
app.use(PasienRoute);
app.use(resepObatRoute);

// Port yang digunakan adalah dari file .env
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});

process.on("SIGINT", () => {
  client.quit();
  process.exit();
});

process.on("SIGTERM", () => {
  client.quit();
  process.exit();
});
