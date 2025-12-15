require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@economy.edu.ly";
    const password = "Admin123!";

    const exists = await User.findOne({ email });
    if (exists) {
      console.log("⚠️ الأدمن موجود مسبقًا");
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name: "Admin",
      email,
      password: hashed,
      role: "admin",
    });

    console.log("✅ تم إنشاء حساب الأدمن");
    console.log("📧 Email:", email);
    console.log("🔐 Password:", password);

    process.exit(0);
  } catch (err) {
    console.error("❌ خطأ:", err.message);
    process.exit(1);
  }
}

createAdmin();
