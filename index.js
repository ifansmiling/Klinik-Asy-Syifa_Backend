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
// // test
// db.authenticate()
//   .then(() => {
//     console.log("Database connected");
//     // Jalankan migrasi otomatis setiap kali server dijalankan
//     db.sync()
//       .then(() => console.log("Database synchronized"))
//       .catch((err) => console.error("Error synchronizing database:", err));
//   })
//   .catch((err) => console.error("Error connecting to database:", err));

// // Memuat konfigurasi dari .env
// dotenv.config();

const app = express();

// Mengkonfigurasi CORS untuk mengizinkan akses dari semua origin
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// Mengkonfigurasi session
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // hanya secure cookie di produksi
    },
  })
);

// Middleware untuk mengurai request body sebagai JSON
app.use(express.json());

// Rute dasar untuk memastikan server berjalan
app.get("/", (req, res) => {
  res.send("Selamat datang di server Klinik Asy-Syifa!");
});

// Menggunakan rute-rute yang telah didefinisikan
app.use(UserRoute);
app.use(RoleRoute);
app.use(PasienRoute);
app.use(ObatRoute);
app.use(AuthRoute);
app.use(ResepObatRoute);
app.use(StokResep);

// Port yang digunakan adalah dari file .env atau default ke 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});

// Tangani sinyal untuk shutdown bersih
process.on("SIGINT", () => {
  // Tutup koneksi yang perlu ditutup dengan aman
  process.exit();
});

process.on("SIGTERM", () => {
  // Tutup koneksi yang perlu ditutup dengan aman
  process.exit();
});

module.exports = app;
