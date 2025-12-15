const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

/* =========================
   تسجيل طالب
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, studentNumber, major } = req.body;

    if (!name || !studentNumber || !major) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }

    // منع تكرار الطالب
    const exists = await User.findOne({ studentNumber });
    if (exists) {
      return res.status(400).json({ message: "الطالب مسجل مسبقًا" });
    }

    const user = await User.create({
      name,
      studentNumber,
      major,
      role: "student",
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

/* =========================
   تسجيل دخول مشرف (Admin)
========================= */
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "البريد وكلمة المرور مطلوبة" });
    }

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(401).json({ message: "غير مصرح" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "كلمة المرور غير صحيحة" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

module.exports = router;
