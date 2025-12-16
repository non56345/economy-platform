const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ===============================
   Middlewares
================================ */
app.use(
  cors({
    origin: "*", // مؤقتًا (يسمح لـ Vercel)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* ===============================
   Routes
================================ */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/questions", require("./routes/questions"));
app.use("/api/stats", require("./routes/stats"));

/* ===============================
   Root route (اختياري لكن مفيد)
================================ */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Economy Platform API is running 🚀",
  });
});

/* ===============================
   Database
================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ تم الاتصال بقاعدة البيانات"))
  .catch((err) => console.error("❌ DB Error:", err));

/* ===============================
   Start Server
================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
