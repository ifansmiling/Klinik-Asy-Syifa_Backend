const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
const UserRoute = require("./routes/UserRoute.js");
const RoleRoute = require("./routes/RoleRoute.js");
const ObatRoute = require("./routes/ObatRoute.js");
const PasienRoute = require("./routes/PasienRoute.js");
const ResepObatRoute = require("./routes/ResepObatRoute.js");
const AuthRoute = require("./routes/AuthRoute.js");
const StokResep = require("./routes/StokRoute.js");

// const db = require("./config/Database.js");

// db.authenticate()
//   .then(() => {
//     console.log("Database connected");
//     // Jalankan migrasi otomatis setiap kali server dijalankan
//     db.sync()
//       .then(() => console.log("Database synchronized"))
//       .catch((err) => console.error("Error synchronizing database:", err));
//   })
//   .catch((err) => console.error("Error connecting to database:", err));

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.URL_BACKEND,
    credentials: true,
  })
);

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

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Selamat datang di server Klinik Asy-Syifa!");
});

// Menggunakan rute-rute yang telah didefinisikan
app.use(UserRoute);
app.use(RoleRoute);
app.use(PasienRoute);
app.use(ObatRoute);
app.use(AuthRoute);
app.use(PasienRoute);
app.use(ResepObatRoute);
app.use(StokResep);

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
