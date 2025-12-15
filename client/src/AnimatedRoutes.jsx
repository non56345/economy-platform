import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

const page = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 },
};

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div {...page}>
              <Landing />
            </motion.div>
          }
        />

        <Route
          path="/register"
          element={
            <motion.div {...page}>
              <Register />
            </motion.div>
          }
        />

        <Route
          path="/student"
          element={
            <motion.div {...page}>
              <StudentDashboard />
            </motion.div>
          }
        />

        <Route
          path="/admin/login"
          element={
            <motion.div {...page}>
              <AdminLogin />
            </motion.div>
          }
        />

        {/* موجودة */}
        <Route
          path="/admin"
          element={
            <motion.div {...page}>
              <AdminDashboard />
            </motion.div>
          }
        />

        {/* 🔥 الجديدة – تحل المشكلة */}
        <Route
          path="/admin/panel"
          element={
            <motion.div {...page}>
              <AdminDashboard />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
